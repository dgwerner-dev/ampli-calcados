import { ref, readonly } from 'vue';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export const useNotifications = () => {
  const notifications = ref<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification,
    };

    notifications.value.push(newNotification);

    // Auto remove after duration
    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const success = (message: string) => {
    addNotification({ type: 'success', message });
  };

  const error = (message: string) => {
    addNotification({ type: 'error', message });
  };

  const warning = (message: string) => {
    addNotification({ type: 'warning', message });
  };

  const info = (message: string) => {
    addNotification({ type: 'info', message });
  };

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  };
};
