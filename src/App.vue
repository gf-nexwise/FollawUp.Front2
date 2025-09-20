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

<script setup>
import { computed, ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/layout/Sidebar.vue'
import Header from './components/layout/Header.vue'
import Notification from './components/common/Notification.vue'

const route = useRoute()

// Verifica se a rota atual é uma rota de autenticação
const isAuthRoute = computed(() => !route.meta.public && route.meta.requiresAuth !== false)

// Sistema de notificações
const notification = ref()
const showNotification = (message, type) => {
  notification.value.showNotification(message, type)
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
