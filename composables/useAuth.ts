import { ref, computed } from 'vue'
import { supabase } from '~/utils/supabase'

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  role: 'USER' | 'ADMIN'
  isActive: boolean
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuth = () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isUser = computed(() => user.value?.role === 'USER')

  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserProfile(session.user.id)
      }
    } catch (err) {
      console.error('Erro ao inicializar autenticação:', err)
    }
  }

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Erro ao carregar perfil:', error)
        return
      }

      user.value = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        role: profile.role,
        isActive: profile.isActive
      }
    } catch (err) {
      console.error('Erro ao carregar perfil do usuário:', err)
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      if (data.user) {
        await loadUserProfile(data.user.id)
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    loading.value = true
    error.value = null
    
    try {
      // Verificar se o email já existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        throw new Error('Este email já está cadastrado')
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })

      if (authError) throw authError

      if (data.user) {
        // Criar perfil do usuário no banco (sempre como USER)
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: name || data.user.user_metadata?.name,
            role: 'USER', // Novos usuários são sempre USER
            isActive: true
          })

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
          // Se falhar ao criar perfil, deletar o usuário de auth
          await supabase.auth.admin.deleteUser(data.user.id)
          throw new Error('Erro ao criar perfil do usuário')
        }

        await loadUserProfile(data.user.id)
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar conta'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createUser = async (email: string, password: string, name?: string) => {
    loading.value = true
    error.value = null
    
    try {
      // Verificar se o usuário atual é admin
      if (!isAdmin.value) {
        throw new Error('Apenas administradores podem criar novos usuários')
      }

      const { data, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name
        }
      })

      if (authError) throw authError

      if (data.user) {
        // Criar perfil do usuário no banco
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: name,
            role: 'USER', // Novos usuários são sempre USER
            isActive: true
          })

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
          throw new Error('Erro ao criar perfil do usuário')
        }

        return data.user
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar usuário'
      throw err
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { error: authError } = await supabase.auth.signOut()
      if (authError) throw authError
      
      user.value = null
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer logout'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (authError) throw authError
    } catch (err: any) {
      error.value = err.message || 'Erro ao enviar email de reset'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (newPassword: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (authError) throw authError
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar senha'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (updates: { name?: string; avatar?: string }) => {
    loading.value = true
    error.value = null
    
    try {
      if (!user.value) throw new Error('Usuário não autenticado')

      const { error: profileError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.value.id)

      if (profileError) throw profileError

      // Atualizar dados do usuário
      if (updates.name) user.value.name = updates.name
      if (updates.avatar) user.value.avatar = updates.avatar
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    isAdmin,
    isUser,
    initAuth,
    signIn,
    signUp,
    createUser,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile
  }
} 