<template>
  <div class="auth-card">
    <div class="auth-header">
      <div class="logo">
        <div class="logo-icon">
          <i class="fas fa-rocket"></i>
        </div>
        <span>FOLLAW<strong>UP</strong></span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <h1>Recuperar Senha</h1>
      <p class="subtitle">Digite seu e-mail para receber as instruções</p>

      <div v-if="!emailSent" class="form-content">
        <div class="form-group">
          <label class="form-label">E-mail</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            required
            placeholder="seu@email.com"
            autocomplete="email"
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="isLoading"
        >
          <i v-if="isLoading" class="fas fa-circle-notch fa-spin"></i>
          <span v-else>Enviar Instruções</span>
        </button>
      </div>

      <div v-else class="success-message">
        <i class="fas fa-check-circle"></i>
        <h3>E-mail Enviado!</h3>
        <p>Enviamos as instruções de recuperação para seu e-mail.</p>
        <p class="small">Verifique também sua caixa de spam.</p>
        <router-link to="/login" class="btn btn-primary btn-block">
          Voltar para o Login
        </router-link>
      </div>

      <div v-if="!emailSent" class="auth-links">
        <router-link to="/login">
          <i class="fas fa-arrow-left"></i>
          Voltar para o Login
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { requestPasswordReset, error, isLoading } = useAuth()

const email = ref('')
const emailSent = ref(false)

const handleSubmit = async () => {
  try {
    await requestPasswordReset(email.value)
    emailSent.value = true
  } catch (err) {
    // Erro já é tratado no composable
  }
}
</script>

