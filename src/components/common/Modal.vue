<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isVisible" class="modal-backdrop" @click="handleClose">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button class="modal-close" @click="handleClose">&times;</button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
          <Spinner v-if="loading" :show="true" message="Carregando..." />

          <!-- Feedback de sucesso/erro -->
          <transition name="feedback">
            <div v-if="feedback.show" class="feedback-overlay">
              <div :class="['feedback-content', `feedback-content--${feedback.type}`]">
                <div class="feedback-icon">
                  <svg v-if="feedback.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path class="feedback-check" d="M20 6L9 17L4 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path class="feedback-error" d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <span class="feedback-message">{{ feedback.message }}</span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import Spinner from './Spinner.vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['close', 'loading-change'])

// Estado local
const loading = ref(false)
const loadingMessage = ref('')
const feedback = ref({
  show: false,
  type: 'success',
  message: '',
  timeout: null
})

// Computed
const isVisible = computed(() => props.visible)

// Métodos
const handleClose = () => {
  if (!loading.value) {
    emit('close')
  }
}

// Métodos expostos para controle de loading e feedback
const startLoading = (message = 'Carregando...') => {
  loading.value = true
  loadingMessage.value = message
  emit('loading-change', true)
}

const stopLoading = () => {
  loading.value = false
  loadingMessage.value = ''
  emit('loading-change', false)
}

const showFeedback = (type, message, duration = 3000) => {
  if (feedback.value.timeout) {
    clearTimeout(feedback.value.timeout)
  }

  feedback.value = {
    show: true,
    type,
    message,
    timeout: setTimeout(() => {
      feedback.value.show = false
    }, duration)
  }
}

const showSuccess = (message) => showFeedback('success', message)
const showError = (message) => showFeedback('error', message)

// Expõe métodos para uso externo
defineExpose({
  startLoading,
  stopLoading,
  showSuccess,
  showError
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Ajuste do Spinner dentro do modal */
.modal-content :deep(.spinner-overlay) {
  position: absolute;
  inset: 0;
  z-index: 99;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--danger);
}

.modal-body {
  padding: 1.5rem;
  position: relative;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Feedback de sucesso/erro */
.feedback-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.feedback-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 16px;
  animation: feedback-pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.feedback-content--success .feedback-icon {
  color: var(--success, #34c759);
}

.feedback-content--error .feedback-icon {
  color: var(--danger, #ff3b30);
}

.feedback-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.feedback-icon svg {
  width: 48px;
  height: 48px;
  stroke: white;
}

.feedback-check {
  stroke-dasharray: 22;
  stroke-dashoffset: 22;
  animation: check 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.2s forwards;
}

.feedback-error {
  stroke-dasharray: 22;
  stroke-dashoffset: 22;
  animation: error-line 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.2s forwards;
}

.feedback-message {
  font-size: 1.125rem;
  font-weight: 500;
  text-align: center;
  color: var(--text-primary);
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

@keyframes feedback-pop {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes check {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes error-line {
  to {
    stroke-dashoffset: 0;
  }
}

/* Animações da transição do feedback */
.feedback-enter-active,
.feedback-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feedback-enter-from,
.feedback-leave-to {
  opacity: 0;
}

/* Outras animações */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
