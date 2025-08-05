import { supabase } from '~/utils/supabase'

export const useAuth = () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Inicializar estado de autenticação
  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user || null
      
      // Escutar mudanças de autenticação
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          user.value = session?.user || null
          loading.value = false
        }
      )

      loading.value = false
      return { subscription }
    } catch (err) {
      error.value = err.message
      loading.value = false
    }
  }

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError
      
      user.value = data.user
      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Registro com email e senha
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || ''
          }
        }
      })

      if (signUpError) throw signUpError
      
      user.value = data.user
      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Logout
  const signOut = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) throw signOutError
      
      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Recuperar senha
  const resetPassword = async (email: string) => {
    try {
      loading.value = true
      error.value = null
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (resetError) throw resetError
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Verificar se está logado
  const isAuthenticated = computed(() => !!user.value)

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    initAuth,
    signIn,
    signUp,
    signOut,
    resetPassword
  }
} 