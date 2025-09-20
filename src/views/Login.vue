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

    <form @submit.prevent="handleLogin" class="auth-form">
      <h1>Bem-vindo de volta!</h1>
      <p class="subtitle">Faça login para continuar</p>

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

      <div class="form-group">
        <div class="form-label-group">
          <label class="form-label">Senha</label>
          <router-link to="/esqueci-senha" class="forgot-password">Esqueci minha senha</router-link>
        </div>
        <input
          v-model="password"
          type="password"
          class="form-control"
          required
          placeholder="••••••••"
          autocomplete="current-password"
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
        <span v-else>Entrar</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login, error, isLoading } = useAuth()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
  } catch (err) {
    // Erro já é tratado no composable
  }
}
</script>