<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-coral-soft to-coral-dark p-6 rounded-2xl shadow-lg">
        <div class="flex items-center">
          <div class="bg-white/20 p-3 rounded-xl mr-4">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white mb-1">Meu Perfil</h1>
            <p class="text-white/80 text-sm">Gerencie seus dados pessoais e preferências</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-16">
      <div class="relative">
        <div
          class="animate-spin rounded-full h-16 w-16 border-4 border-coral-soft/20 border-t-coral-soft"
        ></div>
        <div
          class="absolute inset-0 rounded-full border-4 border-transparent border-t-coral-dark animate-ping"
        ></div>
      </div>
      <div class="mt-6 text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Carregando perfil...</h3>
        <p class="text-gray-500">Aguarde um momento</p>
      </div>
    </div>

    <!-- Profile Form -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Coluna 1 - Dados Pessoais -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <!-- Form Header -->
          <div class="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Dados Pessoais</h2>
            <p class="text-gray-600">Suas informações básicas</p>
          </div>

          <!-- Form Content -->
          <form @submit.prevent="updateProfile" class="p-6 space-y-6">
            <!-- Avatar Section -->
            <div class="flex items-center space-x-6">
              <div class="flex-shrink-0">
                <div class="relative">
                  <div
                    class="w-24 h-24 bg-gradient-to-br from-coral-soft to-coral-dark rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  >
                    {{ userInitials }}
                  </div>
                  <button
                    type="button"
                    @click="triggerFileUpload"
                    class="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
                  >
                    <svg
                      class="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </button>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarChange"
                />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ user?.name || 'Usuário' }}</h3>
                <p class="text-gray-600">{{ user?.email }}</p>
                <p class="text-sm text-gray-500 mt-1">
                  Clique no ícone da câmera para alterar sua foto
                </p>
              </div>
            </div>

            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Digite seu nome completo"
              />
            </div>

            <!-- Email Field (Read-only) -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2"> E-mail </label>
              <input
                id="email"
                :value="user?.email"
                type="email"
                disabled
                class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                placeholder="Seu e-mail"
              />
              <p class="text-sm text-gray-500 mt-1">O e-mail não pode ser alterado</p>
            </div>

            <!-- Phone Field -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2"> Telefone </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="(11) 99999-9999"
              />
            </div>

            <!-- Date of Birth Field -->
            <div>
              <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <input
                id="dateOfBirth"
                v-model="form.dateOfBirth"
                type="date"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            <!-- Preferences Section -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Preferências</h3>

              <div class="space-y-4">
                <!-- Newsletter -->
                <div class="flex items-center">
                  <input
                    id="newsletter"
                    v-model="form.newsletter"
                    type="checkbox"
                    class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                  />
                  <label for="newsletter" class="ml-3 text-sm text-gray-700">
                    Receber ofertas e novidades por e-mail
                  </label>
                </div>

                <!-- SMS Notifications -->
                <div class="flex items-center">
                  <input
                    id="smsNotifications"
                    v-model="form.smsNotifications"
                    type="checkbox"
                    class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                  />
                  <label for="smsNotifications" class="ml-3 text-sm text-gray-700">
                    Receber notificações por SMS
                  </label>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                :disabled="updating"
                class="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-lg text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-coral-soft to-coral-dark hover:from-coral-dark hover:to-coral-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="updating"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {{ updating ? 'Salvando...' : 'Salvar Alterações' }}
              </button>

              <button
                type="button"
                @click="resetForm"
                :disabled="updating"
                class="inline-flex justify-center items-center px-6 py-3 border border-gray-200 shadow-lg text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-coral-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                Restaurar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Coluna 2 - Endereço -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <!-- Form Header -->
          <div class="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Endereço</h2>
            <p class="text-gray-600">Seu endereço de entrega</p>
          </div>

          <!-- Address Form -->
          <div class="p-6 space-y-6">
            <!-- CEP Field -->
            <div>
              <label for="cep" class="block text-sm font-medium text-gray-700 mb-2"> CEP </label>
              <div class="flex space-x-2">
                <input
                  id="cep"
                  v-model="form.cep"
                  type="text"
                  maxlength="9"
                  @blur="searchCep"
                  class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="00000-000"
                />
                <button
                  type="button"
                  @click="searchCep"
                  :disabled="searchingCep"
                  class="px-4 py-3 bg-coral-soft text-white rounded-xl hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="searchingCep"
                    class="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Street Field -->
            <div>
              <label for="street" class="block text-sm font-medium text-gray-700 mb-2">
                Logradouro
              </label>
              <input
                id="street"
                v-model="form.street"
                type="text"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Rua, Avenida, etc."
              />
            </div>

            <!-- Number and Complement -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="number" class="block text-sm font-medium text-gray-700 mb-2">
                  Número
                </label>
                <input
                  id="number"
                  v-model="form.number"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="123"
                />
              </div>

              <div>
                <label for="complement" class="block text-sm font-medium text-gray-700 mb-2">
                  Complemento
                </label>
                <input
                  id="complement"
                  v-model="form.complement"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Apto, Casa, etc."
                />
              </div>
            </div>

            <!-- Neighborhood -->
            <div>
              <label for="neighborhood" class="block text-sm font-medium text-gray-700 mb-2">
                Bairro
              </label>
              <input
                id="neighborhood"
                v-model="form.neighborhood"
                type="text"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Bairro"
              />
            </div>

            <!-- City and State -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  id="city"
                  v-model="form.city"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Cidade"
                />
              </div>

              <div>
                <label for="state" class="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  id="state"
                  v-model="form.state"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Selecione um estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
            </div>

            <!-- Address Info -->
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-blue-900 mb-1">Endereço de Entrega</h4>
                  <p class="text-sm text-blue-700">
                    Este endereço será usado para calcular o frete e fazer entregas dos seus pedidos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, updateProfile: updateUserProfile } = useAuth();
const { success, error } = useNotifications();

// Refs
const fileInput = ref(null);
const loading = ref(false);
const updating = ref(false);
const searchingCep = ref(false);

// Form data
const form = ref({
  name: '',
  phone: '',
  dateOfBirth: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  newsletter: false,
  smsNotifications: false,
});

// Computed
const userInitials = computed(() => {
  if (!user.value?.name) return 'U';
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

// Methods
const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleAvatarChange = event => {
  const file = event.target.files[0];
  if (file) {
    // TODO: Implement avatar upload
    console.log('Avatar file selected:', file);
  }
};

const searchCep = async () => {
  if (!form.value.cep || form.value.cep.length < 8) return;

  searchingCep.value = true;
  try {
    const response = await $fetch(`/api/cep/${form.value.cep.replace(/\D/g, '')}`);

    if (response) {
      form.value.street = response.logradouro || '';
      form.value.neighborhood = response.bairro || '';
      form.value.city = response.localidade || '';
      form.value.state = response.uf || '';
    }
  } catch (err) {
    console.error('Erro ao buscar CEP:', err);
    error('Erro ao buscar CEP. Verifique se o CEP está correto.');
  } finally {
    searchingCep.value = false;
  }
};

const loadUserData = async () => {
  loading.value = true;
  try {
    const profileData = await $fetch('/api/user/profile');

    // Preencher formulário com dados do perfil
    form.value.name = profileData.name || '';
    form.value.phone = profileData.phone || '';
    form.value.dateOfBirth = profileData.dateOfBirth
      ? new Date(profileData.dateOfBirth).toISOString().split('T')[0]
      : '';
    form.value.newsletter = profileData.newsletter || false;
    form.value.smsNotifications = profileData.smsNotifications || false;

    // Preencher dados do endereço se existir
    if (profileData.address) {
      form.value.cep = profileData.address.cep || '';
      form.value.street = profileData.address.street || '';
      form.value.number = profileData.address.number || '';
      form.value.complement = profileData.address.complement || '';
      form.value.neighborhood = profileData.address.neighborhood || '';
      form.value.city = profileData.address.city || '';
      form.value.state = profileData.address.state || '';
    }
  } catch (err) {
    console.error('Erro ao carregar dados do usuário:', err);
    error('Erro ao carregar dados do usuário.');
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  updating.value = true;
  try {
    // Preparar dados para envio
    const profileData = {
      name: form.value.name,
      phone: form.value.phone,
      dateOfBirth: form.value.dateOfBirth,
      newsletter: form.value.newsletter,
      smsNotifications: form.value.smsNotifications,
      address: {
        cep: form.value.cep,
        street: form.value.street,
        number: form.value.number,
        complement: form.value.complement,
        neighborhood: form.value.neighborhood,
        city: form.value.city,
        state: form.value.state,
      },
    };

    // Enviar dados para a API
    await $fetch('/api/user/profile', {
      method: 'PUT',
      body: profileData,
    });

    // Atualizar dados básicos do usuário no estado local
    await updateUserProfile({
      name: form.value.name,
    });

    success('Perfil atualizado com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    error('Erro ao atualizar perfil. Tente novamente.');
  } finally {
    updating.value = false;
  }
};

const resetForm = () => {
  loadUserData();
};

// Lifecycle
onMounted(() => {
  loadUserData();
});
</script>
