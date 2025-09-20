import { ref } from 'vue'
import type { Notification, NotificationOptions, UseNotificationReturn } from '@/types/notifications'

const notifications = ref<Notification[]>([])

export function useNotification(): UseNotificationReturn {
  const notificationsValue = notifications as unknown as { value: Notification[] }
  const showNotification = (options: NotificationOptions | string): void => {
    const id = Date.now().toString()
    
    const notification: Notification = typeof options === 'string'
      ? {
          id,
          message: options,
          type: 'info',
          duration: 3000,
          autoClose: true
        }
      : {
          id,
          ...options,
          duration: options.duration ?? 3000,
          autoClose: options.autoClose ?? true
        }

    notifications.value.push(notification)

    if (notification.autoClose) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }
  }

  const removeNotification = (id: string): void => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = (): void => {
    notifications.value = []
  }

  return {
    notifications: notifications.value,
    showNotification,
    removeNotification,
    clearNotifications
  }
}