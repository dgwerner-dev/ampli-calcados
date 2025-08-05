import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para TypeScript
export interface User {
  id: string
  email: string
  name?: string
  created_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
} 