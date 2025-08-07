<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ getModalTitle() }}
          </h2>
          <button 
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <!-- Login Form -->
          <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="login-email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="login-email"
                v-model="loginForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label for="login-password" class="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="login-password"
                v-model="loginForm.password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="Sua senha"
              />
            </div>

            <div class="flex items-center justify-between">
              <button
                type="button"
                @click="setMode('forgot-password')"
                class="text-sm text-coral-soft hover:text-coral-dark transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-coral-soft text-white py-2 px-4 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>

            <div class="text-center">
              <p class="text-sm text-gray-500">
                Entre em contato com o administrador para criar uma conta
              </p>
            </div>
          </form>



          <!-- Forgot Password Form -->
          <form v-else-if="mode === 'forgot-password'" @submit.prevent="handleForgotPassword" class="space-y-4">
            <div class="text-center mb-4">
              <p class="text-gray-600">
                Digite seu email para receber um link de redefinição de senha.
              </p>
            </div>

            <div>
              <label for="forgot-email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="forgot-email"
                v-model="forgotPasswordForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-coral-soft text-white py-2 px-4 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Enviando...' : 'Enviar Email' }}
            </button>

            <div class="text-center">
              <button
                type="button"
                @click="setMode('login')"
                class="text-sm text-gray-600 hover:text-coral-soft transition-colors"
              >
                Voltar para login
              </button>
            </div>
          </form>

          <!-- Create User Form (Admin Only) -->
          <form v-else-if="mode === 'create-user'" @submit.prevent="handleCreateUser" class="space-y-4">
            <div>
              <label for="create-user-name" class="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                id="create-user-name"
                v-model="createUserForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="Nome do usuário"
              />
            </div>

            <div>
              <label for="create-user-email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="create-user-email"
                v-model="createUserForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label for="create-user-password" class="block text-sm font-medium text-gray-700 mb-1">
                Senha Temporária
              </label>
              <input
                id="create-user-password"
                v-model="createUserForm.password"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="Senha temporária (mínimo 6 caracteres)"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Criando usuário...' : 'Criar Usuário' }}
            </button>

            <div class="text-center">
              <button
                type="button"
                @click="setMode('login')"
                class="text-sm text-gray-600 hover:text-coral-soft transition-colors"
              >
                Voltar para login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const { signIn, createUser, resetPassword, loading, error } = useAuth()

// Estados do formulário
const mode = ref('login')
const successMessage = ref('')

// Formulários
const loginForm = ref({
  email: '',
  password: ''
})

const forgotPasswordForm = ref({
  email: ''
})

const createUserForm = ref({
  name: '',
  email: '',
  password: ''
})

// Métodos
const closeModal = () => {
  emit('close')
  resetForms()
}

const resetForms = () => {
  loginForm.value = { email: '', password: '' }
  forgotPasswordForm.value = { email: '' }
  createUserForm.value = { name: '', email: '', password: '' }
  error.value = null
  successMessage.value = ''
}

const setMode = (newMode) => {
  mode.value = newMode
  resetForms()
}

const getModalTitle = () => {
  switch (mode.value) {
    case 'login': return 'Entrar'
    case 'forgot-password': return 'Recuperar Senha'
    case 'create-user': return 'Criar Novo Usuário'
    default: return 'Autenticação'
  }
}

const handleLogin = async () => {
  try {
    await signIn(loginForm.value.email, loginForm.value.password)
    successMessage.value = 'Login realizado com sucesso!'
    setTimeout(() => closeModal(), 1500)
  } catch (err) {
    // Error já está sendo tratado no composable
  }
}



const handleForgotPassword = async () => {
  try {
    await resetPassword(forgotPasswordForm.value.email)
    successMessage.value = 'Email de recuperação enviado! Verifique sua caixa de entrada.'
    setTimeout(() => setMode('login'), 2000)
  } catch (err) {
    // Error já está sendo tratado no composable
  }
}

const handleCreateUser = async () => {
  try {
    await createUser(createUserForm.value.email, createUserForm.value.password, createUserForm.value.name)
    successMessage.value = 'Usuário criado com sucesso!'
    setTimeout(() => closeModal(), 1500)
  } catch (err) {
    // Error já está sendo tratado no composable
  }
}

// Watch para limpar mensagens quando o modal fecha
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    resetForms()
  }
})
</script> 