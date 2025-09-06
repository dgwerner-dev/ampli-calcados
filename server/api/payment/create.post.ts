import { serverSupabaseUser } from '#supabase/server';
import { usePagBank } from '~/composables/usePagBank';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  try {
    // Verificar autenticação
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    const body = await readBody(event);
    const { orderId, paymentMethod, cardData, installments = 1, customerData } = body;

    // Validar dados obrigatórios
    if (!orderId || !paymentMethod || !customerData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados obrigatórios não fornecidos',
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
    const pagBankOrder = {
      reference_id: orderId,
      customer: {
        name: customerData.name,
        email: customerData.email,
        tax_id: customerData.cpf.replace(/\D/g, ''),
        phones: [
          {
            country: '55',
            area: customerData.phone.substring(0, 2),
            number: customerData.phone.substring(2).replace(/\D/g, ''),
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
          country: 'BR',
          postal_code: customerData.address.zipCode.replace(/\D/g, ''),
        },
      },
      notification_urls: [`${getRequestURL(event).origin}/api/payment/webhook`],
      charges: [
        {
          reference_id: `${orderId}-charge`,
          description: `Pedido ${orderId}`,
          amount: {
            value: Math.round(order.total * 100), // PagBank usa centavos
            currency: 'BRL',
          },
          payment_method:
            paymentMethod === 'pix'
              ? {
                  type: 'pix',
                  expires_in: 3600, // 1 hora
                }
              : {
                  type: 'credit_card',
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
                },
        },
      ],
    };

    // Criar pedido no PagBank
    const pagBank = usePagBank();
    let pagBankResponse;

    if (paymentMethod === 'pix') {
      pagBankResponse = await pagBank.createPixOrder(pagBankOrder);
    } else {
      pagBankResponse = await pagBank.createOrder(pagBankOrder);
    }

    // Montar payload minimizado sem dados sensíveis
    const firstCharge = Array.isArray(pagBankResponse?.charges) ? pagBankResponse.charges[0] : null;
    const sanitizedPaymentData = {
      id: pagBankResponse?.id,
      reference_id: pagBankResponse?.reference_id,
      status: pagBankResponse?.status,
      created_at: pagBankResponse?.created_at,
      amount: pagBankResponse?.amount?.value ?? Math.round(order.total * 100),
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
            payment_method:
              paymentMethod === 'pix'
                ? {
                    type: 'pix',
                    expires_in: firstCharge.payment_method?.pix?.expires_in,
                    pix: {
                      qr_codes: firstCharge.payment_method?.pix?.qr_codes?.map((q: any) => ({
                        text: q.text,
                        links: q.links?.map((l: any) => ({ rel: l.rel, href: l.href })),
                      })),
                    },
                  }
                : {
                    type: 'credit_card',
                    installments: firstCharge.payment_method?.installments,
                    capture: firstCharge.payment_method?.capture,
                  },
          }
        : null,
    };

    // Salvar dados do pagamento no banco
    const { error: paymentError } = await supabase.from('payments').insert({
      orderId,
      userId: user.id,
      pagBankOrderId: pagBankResponse.id,
      pagBankChargeId: firstCharge?.id,
      paymentMethod,
      amount: order.total,
      status: 'PENDING',
      paymentData: sanitizedPaymentData,
    });

    if (paymentError) {
      console.error('Erro ao salvar dados do pagamento:', paymentError);
    }

    return {
      success: true,
      order: pagBankResponse,
      pixQrCode: paymentMethod === 'pix' ? pagBankResponse.charges[0].payment_method.pix : null,
    };
  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro ao processar pagamento',
    });
  }
});
