import { vi } from 'vitest'

// Mock global objects
global.fetch = vi.fn()
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

// Mock window object
Object.defineProperty(window, 'location', {
  value: { href: 'http://localhost:3000' },
  writable: true
})

// Mock process.client
global.process = {
  ...global.process,
  client: true
}

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      signInWithPassword: vi.fn(() => Promise.resolve({ data: { user: null }, error: null }))
    }
  }))
}))

// Mock Nuxt composables
vi.mock('#app', () => ({
  useState: vi.fn((key, defaultFn) => {
    const { ref } = require('vue')
    return ref(defaultFn ? defaultFn() : null)
  }),
  useSupabaseClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      signInWithPassword: vi.fn(() => Promise.resolve({ data: { user: null }, error: null }))
    }
  })),
  $fetch: vi.fn()
}))
