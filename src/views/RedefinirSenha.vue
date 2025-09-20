<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo">
          <div class="logo-icon">
            <i class="fas fa-rocket"></i>
          </div>
          <span>FOLLAW<strong>UP</strong></span>
        </div>
      </div>

      <div v-if="invalidToken" class="auth-form">
        <div class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <h3>Link Inválido</h3>
          <p>Este link de recuperação é inválido ou já expirou.</p>
          <router-link to="/esqueci-senha" class="btn btn-primary">
            Solicitar Novo Link
          </router-link>
        </div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="auth-form">
        <h1>Nova Senha</h1>
        <p class="subtitle">Digite sua nova senha para continuar</p>

        <div v-if="!resetComplete">
          <div class="form-group">
            <label class="form-label">Nova Senha</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              required
              placeholder="••••••••"
              autocomplete="new-password"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Confirmar Nova Senha</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="form-control"
              required
              placeholder="••••••••"
              autocomplete="new-password"
            >
            <div v-if="passwordError" class="input-error">
              {{ passwordError }}
            </div>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            :disabled="isLoading || !isValid"
          >
            <i v-if="isLoading" class="fas fa-circle-notch fa-spin"></i>
            <span v-else>Salvar Nova Senha</span>
          </button>
        </div>

        <div v-else class="success-message">
          <i class="fas fa-check-circle"></i>
          <h3>Senha Alterada!</h3>
          <p>Sua senha foi alterada com sucesso.</p>
          <router-link to="/login" class="btn btn-primary">
            Fazer Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { resetPassword, validateResetToken, error, isLoading } = useAuth()

const token = route.params.token
const invalidToken = ref(false)
const resetComplete = ref(false)
const password = ref('')
const confirmPassword = ref('')

const passwordError = computed(() => {
  if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
    return 'As senhas não correspondem'
  }
  return null
})

const isValid = computed(() => {
  return password.value.length >= 6 && 
         password.value === confirmPassword.value
})

onMounted(async () => {
  const isValid = await validateResetToken(token)
  invalidToken.value = !isValid
})

const handleSubmit = async () => {
  if (!isValid.value) return

  try {
    await resetPassword(token, password.value)
    resetComplete.value = true
  } catch (err) {
    // Erro já é tratado no composable
  }
}
</script>

<style scoped>
.input-error {
  color: var(--danger);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.error-state {
  text-align: center;
  padding: 2rem 0;
  color: var(--danger);
}

.error-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.error-state p {
  color: var(--gray-600);
  margin-bottom: 1.5rem;
}

.success-message {
  text-align: center;
  padding: 2rem 0;
  color: var(--success);
}

.success-message i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.success-message h3 {
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.success-message p {
  color: var(--gray-600);
  margin-bottom: 1.5rem;
}
</style>