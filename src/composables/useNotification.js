import { ref } from "vue"

const notifications = ref([])

export function useNotification() {
  const showNotification = (message, type = "info", duration = 3000) => {
    const id = Date.now()
    const notification = {
      id,
      message,
      type,
      visible: false,
    }

    notifications.value.push(notification)

    setTimeout(() => {
      notification.visible = true
    }, 10)

    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value[index].visible = false
      setTimeout(() => {
        notifications.value.splice(index, 1)
      }, 300)
    }
  }

  return {
    notifications,
    showNotification,
    removeNotification,
  }
}
