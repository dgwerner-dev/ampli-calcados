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
    <ClientOnly>
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Conteúdo do perfil aqui -->
        <template #fallback>
          <div class="flex flex-col justify-center items-center py-16">
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
        </template>
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
                  <!-- Avatar Image or Initials -->
                  <div
                    v-if="user?.avatar && user.avatar.trim() !== ''"
                    class="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg"
                  >
                    <img
                      :src="user.avatar"
                      :alt="user?.name || 'Avatar'"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="w-24 h-24 bg-gradient-to-br from-coral-soft to-coral-dark rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg"
                  >
                    {{ userInitials || 'U' }}
                  </div>

                  <!-- Upload Button -->
                  <button
                    type="button"
                    @click="triggerFileUpload"
                    :disabled="uploadingAvatar"
                    class="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      v-if="uploadingAvatar"
                      class="w-4 h-4 text-gray-600 animate-spin"
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
                    <svg
                      v-else
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
                <h3 class="text-lg font-semibold text-gray-900 mb-1">
                  {{ user?.name || 'Usuário' }}
                </h3>
                <p class="text-gray-600">{{ user?.email || 'Carregando...' }}</p>

                <p class="text-sm text-gray-500 mt-1">
                  {{
                    uploadingAvatar
                      ? 'Enviando foto...'
                      : 'Clique no ícone da câmera para alterar sua foto'
                  }}
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
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                id="email"
                :value="user?.email || ''"
                type="email"
                disabled
                class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                :placeholder="user?.email ? 'Seu e-mail' : 'Carregando...'"
              />
              <p class="text-sm text-gray-500 mt-1">O e-mail não pode ser alterado</p>
            </div>

            <!-- Phone Field -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
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
                <svg
                  v-else
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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

      <!-- Coluna 2 - Endereços -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <!-- Form Header -->
          <div class="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Endereços</h2>
            <p class="text-gray-600">Gerencie seus endereços de entrega</p>
          </div>

          <!-- Address Management -->
          <div class="p-6 space-y-6">
            <!-- Header with Add Button -->
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Endereços Cadastrados</h3>
              <button
                @click="showNewAddressForm = true"
                type="button"
                class="text-sm text-coral-soft hover:text-coral-dark font-medium flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Novo Endereço
              </button>
            </div>

            <!-- Saved Addresses -->
            <div v-if="savedAddresses.length > 0" class="space-y-3">
              <div
                v-for="address in savedAddresses"
                :key="address.id"
                class="border-2 rounded-lg p-4 cursor-pointer transition-all duration-200"
                :class="
                  selectedAddressId === address.id
                    ? 'border-coral-soft bg-coral-soft/5'
                    : 'border-gray-200 hover:border-gray-300'
                "
                @click="selectAddress(address)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <div
                        class="w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center"
                        :class="
                          selectedAddressId === address.id ? 'border-coral-soft' : 'border-gray-300'
                        "
                      >
                        <div
                          v-if="selectedAddressId === address.id"
                          class="w-2 h-2 bg-coral-soft rounded-full"
                        ></div>
                      </div>
                      <span class="font-medium text-gray-900">{{
                        address.name || 'Endereço Principal'
                      }}</span>
                    </div>
                    <p class="text-sm text-gray-600 ml-7">
                      {{ address.street }}, {{ address.number }}
                      <span v-if="address.complement">- {{ address.complement }}</span>
                    </p>
                    <p class="text-sm text-gray-600 ml-7">
                      {{ address.neighborhood }}, {{ address.city }} - {{ address.state }}
                    </p>
                    <p class="text-sm text-gray-600 ml-7">CEP: {{ address.zipCode }}</p>
                  </div>
                  <button
                    @click.stop="deleteAddress(address.id)"
                    type="button"
                    class="text-red-500 hover:text-red-700 ml-2"
                    title="Excluir endereço"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8">
              <div
                class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum endereço salvo</h3>
              <p class="text-gray-600 mb-4">
                Clique em "Novo Endereço" para cadastrar seu primeiro endereço de entrega.
              </p>
              <button
                @click="showNewAddressForm = true"
                type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-coral-soft hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Adicionar Endereço
              </button>
            </div>

            <!-- New Address Form (Hidden by default) -->
            <div v-if="showNewAddressForm" class="border-t border-gray-200 pt-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold text-gray-900">Novo Endereço</h4>
                <button
                  @click="showNewAddressForm = false"
                  type="button"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <form @submit.prevent="saveNewAddress" class="space-y-4">
                <!-- Address Name -->
                <div>
                  <label for="addressName" class="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Endereço
                  </label>
                  <input
                    id="addressName"
                    v-model="newAddress.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Ex: Casa, Trabalho, etc."
                  />
                </div>

                <!-- CEP Field -->
                <div>
                  <label for="newCep" class="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                  </label>
                  <div class="flex space-x-2">
                    <input
                      id="newCep"
                      v-model="newAddress.zipCode"
                      type="text"
                      maxlength="9"
                      @blur="searchNewAddressCep"
                      @input="formatNewAddressCep"
                      class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="00000-000"
                    />
                    <button
                      type="button"
                      @click="searchNewAddressCep"
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
                      <svg
                        v-else
                        class="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                  <label for="newStreet" class="block text-sm font-medium text-gray-700 mb-2">
                    Logradouro
                  </label>
                  <input
                    id="newStreet"
                    v-model="newAddress.street"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Rua, Avenida, etc."
                  />
                </div>

                <!-- Number and Complement -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="newNumber" class="block text-sm font-medium text-gray-700 mb-2">
                      Número
                    </label>
                    <input
                      id="newNumber"
                      v-model="newAddress.number"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <label for="newComplement" class="block text-sm font-medium text-gray-700 mb-2">
                      Complemento
                    </label>
                    <input
                      id="newComplement"
                      v-model="newAddress.complement"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Apto, Casa, etc."
                    />
                  </div>
                </div>

                <!-- Neighborhood -->
                <div>
                  <label for="newNeighborhood" class="block text-sm font-medium text-gray-700 mb-2">
                    Bairro
                  </label>
                  <input
                    id="newNeighborhood"
                    v-model="newAddress.neighborhood"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Bairro"
                  />
                </div>

                <!-- City and State -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="newCity" class="block text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    <input
                      id="newCity"
                      v-model="newAddress.city"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Cidade"
                    />
                  </div>

                  <div>
                    <label for="newState" class="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      id="newState"
                      v-model="newAddress.state"
                      required
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

                <!-- Form Actions -->
                <div class="flex gap-3 pt-4">
                  <button
                    type="submit"
                    :disabled="savingAddress"
                    class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-coral-soft hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      v-if="savingAddress"
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
                    {{ savingAddress ? 'Salvando...' : 'Salvar Endereço' }}
                  </button>
                  <button
                    type="button"
                    @click="showNewAddressForm = false"
                    :disabled="savingAddress"
                    class="px-4 py-2 border border-gray-200 text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
      </ClientOnly>
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
const savingAddress = ref(false);
const uploadingAvatar = ref(false);
const showNewAddressForm = ref(false);
const savedAddresses = ref([]);
const selectedAddressId = ref(null);

// Form data
const form = ref({
  name: '',
  phone: '',
  dateOfBirth: '',
  newsletter: false,
  smsNotifications: false,
});

// New address form
const newAddress = ref({
  name: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
});

// Computed
const userInitials = computed(() => {
  if (!user.value?.name || user.value.name.trim() === '') return 'U';
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

const handleAvatarChange = async event => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    error('Apenas arquivos de imagem são permitidos');
    return;
  }

  // Validar tamanho (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    error('Arquivo muito grande. Máximo 5MB permitido');
    return;
  }

  uploadingAvatar.value = true;
  try {
    // Criar FormData
    const formData = new FormData();
    formData.append('avatar', file);

    // Enviar para a API
    const response = await $fetch('/api/user/avatar', {
      method: 'POST',
      body: formData,
    });

    // Atualizar o avatar no estado do usuário
    if (user.value) {
      user.value.avatar = response.avatar;
    }

    success('Foto atualizada com sucesso!');
  } catch (err) {
    console.error('Erro ao fazer upload do avatar:', err);
    error('Erro ao atualizar foto. Tente novamente.');
  } finally {
    uploadingAvatar.value = false;
    // Limpar o input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const loadSavedAddresses = async () => {
  try {
    const response = await $fetch('/api/addresses');
    savedAddresses.value = response.addresses;
  } catch (error) {
    console.error('Erro ao carregar endereços:', error);
  }
};

const selectAddress = address => {
  selectedAddressId.value = address.id;
};

const deleteAddress = async addressId => {
  if (confirm('Tem certeza que deseja excluir este endereço?')) {
    try {
      await $fetch(`/api/addresses/${addressId}`, { method: 'DELETE' });
      savedAddresses.value = savedAddresses.value.filter(addr => addr.id !== addressId);
      if (selectedAddressId.value === addressId) {
        selectedAddressId.value = null;
      }
      success('Endereço excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir endereço:', error);
      error('Erro ao excluir endereço');
    }
  }
};

const formatNewAddressCep = () => {
  let value = newAddress.value.zipCode.replace(/\D/g, '');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  newAddress.value.zipCode = value;
};

const searchNewAddressCep = async () => {
  const cep = newAddress.value.zipCode.replace(/\D/g, '');
  if (cep.length === 8) {
    searchingCep.value = true;
    try {
      const response = await $fetch(`/api/cep/${cep}`);

      if (response && response.logradouro) {
        newAddress.value.street = response.logradouro;
        newAddress.value.neighborhood = response.bairro;
        newAddress.value.city = response.localidade;
        newAddress.value.state = response.uf;
        success('Endereço encontrado e preenchido automaticamente!');
      } else {
        error('CEP não encontrado');
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
      error('Erro ao buscar CEP. Tente novamente.');
    } finally {
      searchingCep.value = false;
    }
  }
};

const saveNewAddress = async () => {
  savingAddress.value = true;
  try {
    const response = await $fetch('/api/addresses', {
      method: 'POST',
      body: newAddress.value,
    });

    savedAddresses.value.push(response.address);
    showNewAddressForm.value = false;

    // Reset form
    newAddress.value = {
      name: '',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    };

    success('Endereço salvo com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar endereço:', err);
    error('Erro ao salvar endereço. Tente novamente.');
  } finally {
    savingAddress.value = false;
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

    // Carregar endereços
    await loadSavedAddresses();
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
