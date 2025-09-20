<template>
  <header class="header">
    <div class="header-content">
      <div>
        <h1 class="page-title">{{ currentPageTitle }}</h1>
        <p class="page-subtitle">{{ currentPageSubtitle }}</p>
      </div>
      <div class="header-actions">
        <slot name="actions"></slot>
        <div class="user-menu">
          <span class="user-name">{{ user?.nome }}</span>
          <button class="btn btn-secondary btn-sm" @click="confirmLogout">
            <i class="fas fa-sign-out-alt"></i>
            Sair
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouteRecordName } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { user, logout } = useAuth()

// Para impedir logout acidental
const confirmLogout = async () => {
  if (confirm('Deseja realmente sair do sistema?')) {
    await logout()
  }
}

type RouteNames = 
  | 'planos'
  | 'direitos'
  | 'funcionalidades'
  | 'quotas'
  | 'precos'
  | 'papeis'
  | 'permissoes'
  | 'vincular-papeis-permissoes'
  | 'agrupadores'
  | 'vincular-func-permissoes'

const titles: Record<RouteNames, string> = {
  'planos': 'Dashboard de Planos',
  'direitos': 'Direitos e Limites',
  'funcionalidades': 'Funcionalidades',
  'quotas': 'Quotas de Uso',
  'precos': 'Configuração de Preços',
  'papeis': 'Gestão de Papéis',
  'permissoes': 'Gestão de Permissões',
  'vincular-papeis-permissoes': 'Vincular Permissões ao Papel',
  'agrupadores': 'Gestão de Agrupadores',
  'vincular-func-permissoes': 'Vincular Funcionalidades às Permissões'
}

const subtitles: Record<RouteNames, string> = {
  'planos': 'Gerencie dashboard de planos',
  'direitos': 'Gerencie direitos e limites',
  'funcionalidades': 'Gerencie funcionalidades',
  'quotas': 'Gerencie quotas de uso',
  'precos': 'Gerencie configuração de preços',
  'papeis': 'Gerencie papéis do sistema',
  'permissoes': 'Gerencie permissões do sistema',
  'vincular-papeis-permissoes': 'Vincule permissões aos papéis',
  'agrupadores': 'Gerencie agrupadores de funcionalidades',
  'vincular-func-permissoes': 'Vincule funcionalidades às permissões'
}

const currentPageTitle = computed(() => {
  const name = route.name as RouteNames
  return titles[name] || 'Gestão SaaS'
})
const currentPageSubtitle = computed(() => {
  const name = route.name as RouteNames
  return subtitles[name] || 'Gerencie suas configurações'
})

// Movido para cima como confirmLogout
</script>

<style scoped>
.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
  color: var(--gray-700);
}
</style>
