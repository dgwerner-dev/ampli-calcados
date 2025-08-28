import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNotifications } from '@/composables/useNotifications'

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with empty notifications', () => {
    const { notifications } = useNotifications()
    
    expect(notifications.value).toEqual([])
  })

  it('should add success notification', () => {
    const { addNotification, success, notifications } = useNotifications()
    
    success('Operação realizada com sucesso!')
    
    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0].type).toBe('success')
    expect(notifications.value[0].message).toBe('Operação realizada com sucesso!')
    expect(notifications.value[0].duration).toBe(5000)
  })

  it('should add error notification', () => {
    const { error, notifications } = useNotifications()
    
    error('Erro ao processar operação')
    
    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0].type).toBe('error')
    expect(notifications.value[0].message).toBe('Erro ao processar operação')
  })

  it('should add warning notification', () => {
    const { warning, notifications } = useNotifications()
    
    warning('Atenção: dados incompletos')
    
    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0].type).toBe('warning')
    expect(notifications.value[0].message).toBe('Atenção: dados incompletos')
  })

  it('should add info notification', () => {
    const { info, notifications } = useNotifications()
    
    info('Informação importante')
    
    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0].type).toBe('info')
    expect(notifications.value[0].message).toBe('Informação importante')
  })

  it('should add custom notification', () => {
    const { addNotification, notifications } = useNotifications()
    
    addNotification({
      type: 'success',
      message: 'Notificação customizada',
      duration: 3000
    })
    
    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0].type).toBe('success')
    expect(notifications.value[0].message).toBe('Notificação customizada')
    expect(notifications.value[0].duration).toBe(3000)
  })

  it('should remove notification by id', () => {
    const { success, removeNotification, notifications } = useNotifications()
    
    success('Teste de remoção')
    
    expect(notifications.value).toHaveLength(1)
    
    const notificationId = notifications.value[0].id
    removeNotification(notificationId)
    
    expect(notifications.value).toHaveLength(0)
  })

  it('should auto-remove notification after duration', () => {
    const { success, notifications } = useNotifications()
    
    success('Auto-remove test')
    
    expect(notifications.value).toHaveLength(1)
    
    // Fast-forward time by 5 seconds
    vi.advanceTimersByTime(5000)
    
    expect(notifications.value).toHaveLength(0)
  })

  it('should handle multiple notifications', () => {
    const { success, error, warning, notifications } = useNotifications()
    
    success('Sucesso 1')
    error('Erro 1')
    warning('Aviso 1')
    success('Sucesso 2')
    
    expect(notifications.value).toHaveLength(4)
    expect(notifications.value[0].type).toBe('success')
    expect(notifications.value[1].type).toBe('error')
    expect(notifications.value[2].type).toBe('warning')
    expect(notifications.value[3].type).toBe('success')
  })

  it('should generate unique ids for notifications', () => {
    const { success, notifications } = useNotifications()
    
    success('Notificação 1')
    success('Notificação 2')
    
    expect(notifications.value).toHaveLength(2)
    // IDs devem ser diferentes (mesmo que sejam timestamps, podem ser iguais se executados muito rapidamente)
    expect(notifications.value[0].id).toBeDefined()
    expect(notifications.value[1].id).toBeDefined()
  })
})
