<template>
  <transition name="spinner">
    <div v-if="show" class="spinner-overlay">
      <div class="spinner-content">
        <div class="spinner-icon">
          <svg viewBox="0 0 50 50" fill="none" stroke="currentColor">
            <circle cx="25" cy="25" r="20" stroke-width="4" />
            <circle class="spinner-progress" cx="25" cy="25" r="20" stroke-width="4" />
          </svg>
        </div>
        <span v-if="message" class="spinner-message">{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Spinner',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ""
    }
  }
})
</script>

<style scoped>
.spinner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.spinner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 16px;
  animation: spinner-pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.spinner-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary, #2196f3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.spinner-icon svg {
  width: 48px;
  height: 48px;
  stroke: rgba(255, 255, 255, 0.3);
  animation: spin 1.5s linear infinite;
}

.spinner-icon .spinner-progress {
  stroke: white;
  stroke-dasharray: 126;
  stroke-dashoffset: 126;
  animation: spinner-dash 1.5s ease-in-out infinite;
}

.spinner-message {
  font-size: 1.125rem;
  font-weight: 500;
  text-align: center;
  color: var(--text-primary);
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

@keyframes spinner-pop {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinner-dash {
  0% {
    stroke-dashoffset: 126;
  }
  50% {
    stroke-dashoffset: 32;
  }
  100% {
    stroke-dashoffset: 126;
  }
}

/* Animações da transição do spinner */
.spinner-enter-active,
.spinner-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.spinner-enter-from,
.spinner-leave-to {
  opacity: 0;
}
</style>
