import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuth } from '@/composables/useAuth'

// Mock Supabase
const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn()
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn()
      }))
    }))
  }))
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabase)
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with no user', () => {
    const { user, isAuthenticated, isAdmin, isUser } = useAuth()
    
    expect(user.value).toBeNull()
    expect(isAuthenticated.value).toBe(false)
    expect(isAdmin.value).toBe(false)
    expect(isUser.value).toBe(false)
  })

  it('should sign in successfully', async () => {
    const { signIn } = useAuth()
    
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '1', email: 'test@test.com' } },
      error: null
    })

    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'USER'
      },
      error: null
    })

    const result = await signIn('test@test.com', 'password')
    
    expect(result.success).toBe(true)
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password'
    })
  })

  it('should handle sign in error', async () => {
    const { signIn } = useAuth()
    
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid credentials' }
    })

    const result = await signIn('test@test.com', 'wrongpassword')
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid credentials')
  })

  it('should sign out successfully', async () => {
    const { signOut } = useAuth()
    
    mockSupabase.auth.signOut.mockResolvedValue({
      error: null
    })

    const result = await signOut()
    
    expect(result.success).toBe(true)
    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })

  it('should check if user is admin', () => {
    const { user, isAdmin } = useAuth()
    
    // Mock admin user
    user.value = {
      id: '1',
      email: 'admin@test.com',
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true
    }
    
    expect(isAdmin.value).toBe(true)
  })

  it('should check if user is regular user', () => {
    const { user, isUser } = useAuth()
    
    // Mock regular user
    user.value = {
      id: '1',
      email: 'user@test.com',
      name: 'Regular User',
      role: 'USER',
      isActive: true
    }
    
    expect(isUser.value).toBe(true)
  })

  it('should check if user is authenticated', () => {
    const { user, isAuthenticated } = useAuth()
    
    // Mock authenticated user
    user.value = {
      id: '1',
      email: 'user@test.com',
      name: 'User',
      role: 'USER',
      isActive: true
    }
    
    expect(isAuthenticated.value).toBe(true)
  })
})
