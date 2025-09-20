<template>
  <div class="app-container">
    <!-- Layout do sistema (apenas para rotas autenticadas) -->
    <template v-if="isAuthRoute">
      <Sidebar />
      <main class="main-content">
        <Header />
        <div class="content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </template>

    <!-- Layout de autenticação (login, recuperação de senha, etc) -->
    <template v-else>
      <div class="auth-layout">
        <Suspense>
          <router-view v-slot="{ Component }">
            <transition name="slide-fade" mode="out-in" :duration="{ enter: 200, leave: 150 }">
              <component :is="Component" />
            </transition>
          </router-view>
        </Suspense>
      </div>
    </template>

    <Notification ref="notification" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/layout/Sidebar.vue'
import Header from './components/layout/Header.vue'
import Notification from './components/common/Notification.vue'
import type { NotificationType } from '@/types/notifications'

const route = useRoute()

// Verifica se a rota atual é uma rota pública (login, recuperação de senha, etc)
const isAuthRoute = computed(() => !route.meta.public)

// Sistema de notificações
const notification = ref<InstanceType<typeof Notification> | null>(null)
const showNotification = (message: string, type: NotificationType = 'info'): void => {
  notification.value?.showNotification(message, type)
}

// Fornece o método de notificação para toda a aplicação
provide('showNotification', showNotification)
</script>

<style>
.auth-layout {
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  overflow: auto;
  padding: 2rem;
}

/* Estilos específicos para o card de autenticação */
.auth-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header .logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 1rem;
}

.auth-header .logo-icon {
  background: var(--primary);
  color: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.auth-form h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.auth-form .subtitle {
  color: var(--gray-600);
  margin-bottom: 2rem;
}

.auth-form .form-group {
  margin-bottom: 1.5rem;
}

.auth-form .form-label-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.auth-form .forgot-password {
  font-size: 0.875rem;
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s;
}

.auth-form .forgot-password:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.auth-form .error-message {
  color: var(--danger);
  background: var(--danger-light);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

/* Transição suave entre as telas de auth */
.slide-fade-enter-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
