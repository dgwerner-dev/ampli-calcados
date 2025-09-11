import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import { usePagBank } from '~/composables/usePagBank';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  try {
    const config = useRuntimeConfig();
    // Verificar autenticação
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    const body = await readBody(event);
    const supabase = await serverSupabaseClient(event);
    const {
      orderId,
      paymentMethod,
      cardData,
      installments = 1,
      customerData,
      shippingOption,
    } = body;

    // Validar dados obrigatórios
    if (!orderId || !paymentMethod || !customerData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados obrigatórios não fornecidos',
      });
    }

    // Validação básica dos dados do cliente para evitar campos nulos no PagBank
    const cpfDigits = (customerData?.cpf || '').replace(/\D/g, '');
    const phoneDigitsAll = (customerData?.phone || '').replace(/\D/g, '');
    const address = customerData?.address || {};
    const missingFields: string[] = [];
    if (!customerData?.name) missingFields.push('customer.name');
    if (!customerData?.email) missingFields.push('customer.email');
    if (cpfDigits.length !== 11) missingFields.push('customer.tax_id(cpf 11 dígitos)');
    if (phoneDigitsAll.length < 10) missingFields.push('customer.phones.number(10-11 dígitos)');
    if (!address.street) missingFields.push('shipping.address.street');
    if (!address.number) missingFields.push('shipping.address.number');
    if (!address.neighborhood) missingFields.push('shipping.address.locality');
    if (!address.city) missingFields.push('shipping.address.city');
    if (!address.state) missingFields.push('shipping.address.region_code');
    if ((address.zipCode || '').replace(/\D/g, '').length !== 8)
      missingFields.push('shipping.address.postal_code(CEP 8 dígitos)');

    if (missingFields.length) {
      throw createError({
        statusCode: 400,
        statusMessage: `Dados inválidos: ${missingFields.join(', ')}`,
      });
    }

    // Buscar dados do pedido via Prisma
    const prisma = new PrismaClient();
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });

    await prisma.$disconnect();

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pedido não encontrado',
      });
    }

    // Preparar dados para o PagBank
    // Normalizar telefone (somente dígitos)
    const phoneDigits = (customerData.phone || '').replace(/\D/g, '');
    const phoneArea = phoneDigits.slice(0, 2);
    const phoneNumberDigits = phoneDigits.slice(2);
    const phoneNumber = phoneNumberDigits ? parseInt(phoneNumberDigits, 10) : undefined;

    // Definir notification URL: em dev usar PAGBANK_WEBHOOK_PUBLIC_URL; em prod usar origin https
    const origin = getRequestURL(event).origin;
    const candidateNotificationUrl = process.dev
      ? (config as any).pagbankWebhookPublicUrl || ''
      : `${origin}/api/payment/webhook`;
    let notificationUrls: string[] | undefined = undefined;
    try {
      const urlObj = new URL(candidateNotificationUrl);
      if (urlObj.protocol === 'https:') {
        notificationUrls = [candidateNotificationUrl];
      }
    } catch {}

    const baseOrder = {
      reference_id: orderId,
      customer: {
        name: customerData.name,
        email: customerData.email,
        tax_id: cpfDigits,
        phones: [
          {
            country: '55',
            area: phoneArea,
            number: phoneNumber,
            type: 'MOBILE',
          },
        ],
      },
      items: order.orderItems.map((item: any) => ({
        reference_id: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        unit_amount: Math.round(item.price * 100), // PagBank usa centavos
      })),
      shipping: {
        address: {
          street: customerData.address.street,
          number: customerData.address.number,
          locality: customerData.address.neighborhood,
          city: customerData.address.city,
          region_code: customerData.address.state,
          country: 'BRA',
          postal_code: customerData.address.zipCode.replace(/\D/g, ''),
        },
      },
      ...(notificationUrls ? { notification_urls: notificationUrls } : {}),
    } as any;

    // Calcular frete escolhido e atualizar total do pedido (subtotal + frete + impostos)
    const shippingCostCandidate = Number(shippingOption?.cost ?? 0);
    // Subtotal calculado a partir dos itens (mais confiável que depender de total prévio)
    const itemsSubtotal = order.orderItems.reduce((acc: number, it: any) => {
      const price = Number((it.price as any)?.toString?.() || it.price || 0);
      return acc + price * (it.quantity || 0);
    }, 0);
    const currentTax = 0;
    // Se frete não vier no body, usar o que já estiver no pedido
    const shippingCost =
      shippingCostCandidate > 0 ? shippingCostCandidate : Number(order.shipping as any) || 0;
    if (!shippingCost || shippingCost <= 0) {
      console.warn('[PagBank] Frete ausente ao criar pagamento. Pedido:', orderId);
    }
    const newOrderTotal = itemsSubtotal + shippingCost + currentTax;

    // Persistir apenas frete no pedido (total permanece como subtotal dos itens)
    try {
      const prismaUpdateTotals = new PrismaClient();
      await prismaUpdateTotals.order.update({
        where: { id: orderId },
        data: {
          shipping: shippingCost,
          tax: currentTax,
        },
      });
      await prismaUpdateTotals.$disconnect();
    } catch (e) {
      console.error('Erro ao atualizar frete/total do pedido:', e);
    }

    const totalWithShippingCents = Math.round(newOrderTotal * 100);

    const pagBankOrder =
      paymentMethod === 'pix'
        ? {
            ...baseOrder,
            qr_codes: [
              {
                amount: { 
                  value: totalWithShippingCents,
                  currency: 'BRL'
                },
                expires_in: 3600, // 1 hora
              },
            ],
          }
        : paymentMethod === 'boleto'
        ? {
            ...baseOrder,
            charges: [
              {
                reference_id: `${orderId}-charge`,
                description: `Pedido ${orderId}`,
                amount: {
                  value: totalWithShippingCents,
                  currency: 'BRL',
                },
                payment_method: {
                  type: 'boleto',
                  boleto: {
                    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias
                    instruction_lines: {
                      line_1: 'Pagamento referente ao pedido',
                      line_2: 'Não receber após o vencimento',
                    },
                    holder: {
                      name: customerData.name,
                      tax_id: cpfDigits,
                      email: customerData.email,
                      address: {
                        street: address.street,
                        number: address.number,
                        locality: address.neighborhood,
                        city: address.city,
                        region_code: address.state,
                        country: 'BR',
                        postal_code: address.zipCode.replace(/\D/g, ''),
                      },
                    },
                  },
                },
              },
            ],
          }
        : {
            ...baseOrder,
            charges: [
              {
                reference_id: `${orderId}-charge`,
                description: `Pedido ${orderId}`,
                amount: {
                  value: totalWithShippingCents,
                  currency: 'BRL',
                },
                payment_method: {
                  type: paymentMethod === 'debit_card' ? 'debit_card' : 'credit_card',
                  installments,
                  capture: true,
                  card: cardData
                    ? {
                        number: cardData.number.replace(/\s/g, ''),
                        exp_month: cardData.expMonth,
                        exp_year: cardData.expYear,
                        security_code: cardData.cvv,
                        holder: {
                          name: cardData.holderName,
                        },
                      }
                    : undefined,
                  soft_descriptor: 'BARTEZEN',
                  // 3DS obrigatório para débito
                  ...(paymentMethod === 'debit_card' && {
                    authentication_method: {
                      type: 'THREEDS',
                      id: crypto.randomUUID(),
                    },
                  }),
                },
              },
            ],
          };

    // Criar pedido no PagBank
    const pagBank = usePagBank();
    let pagBankResponse;

    // Para PIX usamos o formato com qr_codes; para cartão, charges
    pagBankResponse = await pagBank.createOrder(pagBankOrder);

    // Montar payload minimizado sem dados sensíveis
    const firstCharge = Array.isArray(pagBankResponse?.charges) ? pagBankResponse.charges[0] : null;
    const firstQr = Array.isArray(pagBankResponse?.qr_codes) ? pagBankResponse.qr_codes[0] : null;
    const sanitizedPaymentData = {
      id: pagBankResponse?.id,
      reference_id: pagBankResponse?.reference_id,
      status: pagBankResponse?.status,
      created_at: pagBankResponse?.created_at,
      amount: pagBankResponse?.amount?.value ?? totalWithShippingCents,
      currency: pagBankResponse?.amount?.currency ?? 'BRL',
      charge: firstCharge
        ? {
            id: firstCharge.id,
            reference_id: firstCharge.reference_id,
            status: firstCharge.status,
            links: firstCharge.links?.map((l: any) => ({
              rel: l.rel,
              href: l.href,
              media: l.media,
            })),
            payment_method: {
              type: 'credit_card',
              installments: firstCharge.payment_method?.installments,
              capture: firstCharge.payment_method?.capture,
            },
          }
        : null,
      qr_codes:
        firstQr && paymentMethod === 'pix'
          ? [
              {
                text: firstQr.text,
                links: firstQr.links?.map((l: any) => ({ rel: l.rel, href: l.href })),
              },
            ]
          : undefined,
    };

    // Salvar dados do pagamento no banco
    const paymentMethodEnum =
      paymentMethod === 'pix'
        ? 'PIX'
        : paymentMethod === 'credit_card'
          ? 'CREDIT_CARD'
          : paymentMethod?.toString().toUpperCase();

    const pagBankChargeIdToSave =
      firstCharge?.id || (paymentMethod === 'pix' ? `${pagBankResponse.id}-pix` : 'N/A');
    const nowIso = new Date().toISOString();
    const amountNumber = Number(newOrderTotal);

    const { error: paymentError } = await supabase.from('payments').insert({
      id: crypto.randomUUID(),
      orderId,
      userId: user.id,
      pagBankOrderId: pagBankResponse.id,
      pagBankChargeId: pagBankChargeIdToSave,
      paymentMethod: paymentMethodEnum,
      amount: amountNumber,
      status: 'PENDING',
      paymentData: sanitizedPaymentData,
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    if (paymentError) {
      console.error('Erro ao salvar dados do pagamento:', paymentError);
    }

    // Atualizar status do pedido para PENDING (aguardando pagamento)
    try {
      const prismaUpdate = new PrismaClient();
      await prismaUpdate.order.update({
        where: { id: orderId },
        data: { status: 'PENDING' as any },
      });
      await prismaUpdate.$disconnect();
    } catch (e) {
      console.error('Erro ao atualizar status do pedido para PENDING:', e);
    }

    return {
      success: true,
      order: pagBankResponse,
      pixQrCode:
        paymentMethod === 'pix'
          ? firstQr
            ? { text: firstQr.text, links: firstQr.links }
            : null
          : null,
    };
  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro ao processar pagamento',
    });
  }
});
