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
          <button class="btn btn-secondary btn-sm" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
            Sair
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { user, logout } = useAuth()

const titles = {
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

const subtitles = {
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

const currentPageTitle = computed(() => titles[route.name] || 'Gestão SaaS')
const currentPageSubtitle = computed(() => subtitles[route.name] || 'Gerencie suas configurações')

const handleLogout = async () => {
  await logout()
}
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
