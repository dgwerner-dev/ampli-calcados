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
            {{ isLogin ? 'Entrar' : 'Criar Conta' }}
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
          <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
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
                @click="showForgotPassword = true"
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
          </form>

          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label for="register-name" class="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                id="register-name"
                v-model="registerForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label for="register-email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="register-email"
                v-model="registerForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label for="register-password" class="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="register-password"
                v-model="registerForm.password"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label for="register-confirm-password" class="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <input
                id="register-confirm-password"
                v-model="registerForm.confirmPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="Confirme sua senha"
              />
            </div>

            <button
              type="submit"
              :disabled="loading || !passwordsMatch"
              class="w-full bg-coral-soft text-white py-2 px-4 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Criando conta...' : 'Criar Conta' }}
            </button>
          </form>

          <!-- Forgot Password Form -->
          <form v-if="showForgotPassword" @submit.prevent="handleForgotPassword" class="space-y-4">
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
              {{ loading ? 'Enviando...' : 'Enviar Link de Recuperação' }}
            </button>

            <button
              type="button"
              @click="showForgotPassword = false"
              class="w-full text-gray-600 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="text-center">
            <p class="text-sm text-gray-600">
              {{ isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
              <button
                @click="toggleMode"
                class="text-coral-soft hover:text-coral-dark font-medium transition-colors"
              >
                {{ isLogin ? 'Criar conta' : 'Fazer login' }}
              </button>
            </p>
          </div>
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

const { signIn, signUp, resetPassword, loading, error } = useAuth()

// Form states
const isLogin = ref(true)
const showForgotPassword = ref(false)
const successMessage = ref('')

// Login form
const loginForm = ref({
  email: '',
  password: ''
})

// Register form
const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Forgot password form
const forgotPasswordForm = ref({
  email: ''
})

// Computed
const passwordsMatch = computed(() => {
  return registerForm.value.password === registerForm.value.confirmPassword
})

// Methods
const closeModal = () => {
  emit('close')
  resetForms()
}

const resetForms = () => {
  loginForm.value = { email: '', password: '' }
  registerForm.value = { name: '', email: '', password: '', confirmPassword: '' }
  forgotPasswordForm.value = { email: '' }
  error.value = null
  successMessage.value = ''
  showForgotPassword.value = false
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  resetForms()
}

const handleLogin = async () => {
  const result = await signIn(loginForm.value.email, loginForm.value.password)
  
  if (result.success) {
    successMessage.value = 'Login realizado com sucesso!'
    setTimeout(() => {
      closeModal()
    }, 1500)
  }
}

const handleRegister = async () => {
  if (!passwordsMatch.value) {
    error.value = 'As senhas não coincidem'
    return
  }

  const result = await signUp(
    registerForm.value.email, 
    registerForm.value.password, 
    registerForm.value.name
  )
  
  if (result.success) {
    successMessage.value = 'Conta criada com sucesso! Verifique seu email.'
    setTimeout(() => {
      closeModal()
    }, 2000)
  }
}

const handleForgotPassword = async () => {
  const result = await resetPassword(forgotPasswordForm.value.email)
  
  if (result.success) {
    successMessage.value = 'Email de recuperação enviado!'
    setTimeout(() => {
      showForgotPassword.value = false
      resetForms()
    }, 2000)
  }
}
</script> 