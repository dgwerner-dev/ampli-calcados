<template>
  <div class="max-w-4xl mx-auto py-16 px-4 text-gray-800">
    <h1 class="text-3xl font-bold mb-6">Política de Privacidade</h1>
    <p class="mb-4">
      Esta política descreve como coletamos, usamos e compartilhamos seus dados pessoais.
    </p>
    <h2 class="text-xl font-semibold mt-8 mb-2">Dados coletados</h2>
    <ul class="list-disc ml-6 space-y-1">
      <li>Cadastro: nome, email, senha (via Supabase), avatar</li>
      <li>Perfil: CPF, telefone, data de nascimento, preferências</li>
      <li>Endereços de entrega</li>
      <li>Pedidos e pagamentos (processados pelo PagBank)</li>
    </ul>
    <h2 class="text-xl font-semibold mt-8 mb-2">Finalidades</h2>
    <ul class="list-disc ml-6 space-y-1">
      <li>Criação e gestão de conta</li>
      <li>Processamento de pedidos, pagamento e entrega</li>
      <li>Atendimento e comunicações transacionais</li>
      <li>Marketing com consentimento (newsletter/SMS)</li>
    </ul>
    <h2 class="text-xl font-semibold mt-8 mb-2">Compartilhamento</h2>
    <p>
      Compartilhamos dados com PagBank (pagamentos) e serviços de CEP/Correios para cálculo/entrega.
    </p>
    <h2 class="text-xl font-semibold mt-8 mb-2">Seus direitos</h2>
    <ul class="list-disc ml-6 space-y-1">
      <li>Acesso e exportação dos seus dados</li>
      <li>Correção e atualização</li>
      <li>Exclusão/anonimização, quando aplicável</li>
      <li>Revogação de consentimentos</li>
    </ul>
    <h2 class="text-xl font-semibold mt-8 mb-2">Contato do DPO</h2>
    <p>Para exercer seus direitos, contate: dpo@ampli.com.br</p>
    <h2 class="text-xl font-semibold mt-8 mb-2">Cookies</h2>
    <p>
      Utilizamos cookies essenciais para autenticação e funcionamento do site. Saiba mais na nossa
      Política de Cookies.
    </p>
    <p class="text-sm text-gray-500 mt-8">
      Última atualização: {{ new Date().toLocaleDateString() }}
    </p>
  </div>
</template>

<script setup>
useHead({ title: 'Política de Privacidade - AMPLI CALÇADOS' });
</script>
