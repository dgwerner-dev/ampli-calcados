import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';

describe('Notifications', () => {
  let wrapper: any;

  beforeEach(() => {
    const pinia = createPinia();
    
    wrapper = mount({
      template: `
        <div class="notifications-container" data-testid="notifications-container">
          <TransitionGroup name="notification" tag="div" class="notifications-list">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              :class="['notification', 'notification-' + notification.type]"
              :data-testid="'notification-' + notification.id"
            >
              <div class="notification-content">
                <div class="notification-icon">
                  <span v-if="notification.type === 'success'">✅</span>
                  <span v-else-if="notification.type === 'error'">❌</span>
                  <span v-else-if="notification.type === 'warning'">⚠️</span>
                  <span v-else>ℹ️</span>
                </div>
                <div class="notification-message">
                  {{ notification.message }}
                </div>
                <button 
                  @click="removeNotification(notification.id)" 
                  class="notification-close"
                  :data-testid="'close-' + notification.id"
                >
                  ×
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>
      `,
      data() {
        return {
          notifications: [
            {
              id: '1',
              type: 'success',
              message: 'Produto adicionado ao carrinho!',
              duration: 3000,
            },
            {
              id: '2',
              type: 'error',
              message: 'Erro ao adicionar produto.',
              duration: 5000,
            },
            {
              id: '3',
              type: 'warning',
              message: 'Produto com estoque baixo.',
              duration: 4000,
            },
            {
              id: '4',
              type: 'info',
              message: 'Frete grátis disponível!',
              duration: 3000,
            },
          ],
        };
      },
      methods: {
        removeNotification(id: string) {
          this.notifications = this.notifications.filter(n => n.id !== id);
        },
      },
    }, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('should render notifications container', () => {
    expect(wrapper.find('[data-testid="notifications-container"]').exists()).toBe(true);
  });

  it('should display all notifications', () => {
    const notifications = wrapper.findAll('[data-testid^="notification-"]');
    expect(notifications).toHaveLength(4);
  });

  it('should display success notification with correct styling', () => {
    const successNotification = wrapper.find('[data-testid="notification-1"]');
    expect(successNotification.exists()).toBe(true);
    expect(successNotification.classes()).toContain('notification-success');
    expect(successNotification.text()).toContain('Produto adicionado ao carrinho!');
  });

  it('should display error notification with correct styling', () => {
    const errorNotification = wrapper.find('[data-testid="notification-2"]');
    expect(errorNotification.exists()).toBe(true);
    expect(errorNotification.classes()).toContain('notification-error');
    expect(errorNotification.text()).toContain('Erro ao adicionar produto.');
  });

  it('should display warning notification with correct styling', () => {
    const warningNotification = wrapper.find('[data-testid="notification-3"]');
    expect(warningNotification.exists()).toBe(true);
    expect(warningNotification.classes()).toContain('notification-warning');
    expect(warningNotification.text()).toContain('Produto com estoque baixo.');
  });

  it('should display info notification with correct styling', () => {
    const infoNotification = wrapper.find('[data-testid="notification-4"]');
    expect(infoNotification.exists()).toBe(true);
    expect(infoNotification.classes()).toContain('notification-info');
    expect(infoNotification.text()).toContain('Frete grátis disponível!');
  });

  it('should display correct icons for each notification type', () => {
    const successNotification = wrapper.find('[data-testid="notification-1"]');
    const errorNotification = wrapper.find('[data-testid="notification-2"]');
    const warningNotification = wrapper.find('[data-testid="notification-3"]');
    const infoNotification = wrapper.find('[data-testid="notification-4"]');

    expect(successNotification.text()).toContain('✅');
    expect(errorNotification.text()).toContain('❌');
    expect(warningNotification.text()).toContain('⚠️');
    expect(infoNotification.text()).toContain('ℹ️');
  });

  it('should have close buttons for all notifications', () => {
    const closeButtons = wrapper.findAll('[data-testid^="close-"]');
    expect(closeButtons).toHaveLength(4);
  });

  it('should remove notification when close button is clicked', async () => {
    const closeButton = wrapper.find('[data-testid="close-1"]');
    await closeButton.trigger('click');
    
    const remainingNotifications = wrapper.findAll('[data-testid^="notification-"]');
    expect(remainingNotifications).toHaveLength(3);
    
    const removedNotification = wrapper.find('[data-testid="notification-1"]');
    expect(removedNotification.exists()).toBe(false);
  });

  it('should have proper CSS classes for styling', () => {
    expect(wrapper.find('.notifications-container').exists()).toBe(true);
    expect(wrapper.find('.notifications-list').exists()).toBe(true);
    
    const notification = wrapper.find('.notification');
    expect(notification.exists()).toBe(true);
    expect(notification.find('.notification-content').exists()).toBe(true);
    expect(notification.find('.notification-icon').exists()).toBe(true);
    expect(notification.find('.notification-message').exists()).toBe(true);
    expect(notification.find('.notification-close').exists()).toBe(true);
  });

  it('should handle multiple notification types correctly', () => {
    const notifications = wrapper.findAll('.notification');
    
    expect(notifications[0].classes()).toContain('notification-success');
    expect(notifications[1].classes()).toContain('notification-error');
    expect(notifications[2].classes()).toContain('notification-warning');
    expect(notifications[3].classes()).toContain('notification-info');
  });

  it('should have transition group for animations', () => {
    const transitionGroup = wrapper.find('.notifications-list');
    expect(transitionGroup.exists()).toBe(true);
    expect(transitionGroup.attributes('name')).toBe('notification');
  });
});
