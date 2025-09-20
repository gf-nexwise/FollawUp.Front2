<template>
  <teleport to="body">
    <div class="notification-container">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification', `notification-${notification.type}`, { visible: notification.visible }]"
          @click="removeNotification(notification.id)"
        >
          {{ notification.message }}
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'Notification',
  data() {
    return {
      notifications: []
    }
  },
  methods: {
    showNotification(message, type = 'info', duration = 3000) {
      const id = Date.now()
      const notification = {
        id,
        message,
        type,
        visible: false,
      }

      this.notifications.push(notification)

      setTimeout(() => {
        notification.visible = true
      }, 10)

      setTimeout(() => {
        this.removeNotification(id)
      }, duration)
    },
    removeNotification(id) {
      const index = this.notifications.findIndex((n) => n.id === id)
      if (index > -1) {
        this.notifications[index].visible = false
        setTimeout(() => {
          this.notifications.splice(index, 1)
        }, 300)
      }
    }
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  pointer-events: none;
}

.notification {
  background: var(--primary);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  margin-bottom: 0.5rem;
  max-width: 400px;
  word-wrap: break-word;
  cursor: pointer;
  pointer-events: all;
  transform: translateX(120%);
  transition: transform 0.3s ease-in-out;
}

.notification.visible {
  transform: translateX(0);
}

.notification-success {
  background: var(--success);
}

.notification-error {
  background: var(--error);
}

.notification-warning {
  background: var(--warning);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(120%);
}
</style>
