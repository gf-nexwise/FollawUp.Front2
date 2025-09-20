<template>
  <nav class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <div class="logo" :class="{ 'centered': !isCollapsed }">
        <div class="logo-icon">
          <i class="fas fa-rocket"></i>
        </div>
        <span class="logo-text">FOLLAW<strong>UP</strong></span>
      </div>
    </div>
    <div class="nav-menu">
      <div class="nav-section">
        <div class="nav-section-title" v-show="!isCollapsed">Gestão de Planos</div>
        <router-link to="/planos" class="nav-item">
          <i class="fas fa-layer-group"></i>
          <span class="nav-text">Planos</span>
        </router-link>
        <router-link to="/direitos" class="nav-item">
          <i class="fas fa-shield-alt"></i>
          <span>Direitos & Limites</span>
        </router-link>
        <router-link to="/funcionalidades" class="nav-item">
          <i class="fas fa-puzzle-piece"></i>
          <span>Funcionalidades</span>
        </router-link>
        <router-link to="/precos" class="nav-item">
          <i class="fas fa-dollar-sign"></i>
          <span>Preços</span>
        </router-link>
        <router-link to="/quotas" class="nav-item">
          <i class="fas fa-chart-pie"></i>
          <span>Quotas de Uso</span>
        </router-link>
      </div>
      
      <div class="nav-section">
        <div class="nav-section-title">Controle de Acesso</div>
        <router-link to="/papeis" class="nav-item">
          <i class="fas fa-user-tag"></i>
          <span>Papéis</span>
        </router-link>
        <router-link to="/permissoes" class="nav-item">
          <i class="fas fa-shield-alt"></i>
          <span>Permissões</span>
        </router-link>
        <router-link to="/vincular-papeis-permissoes" class="nav-item">
          <i class="fas fa-user-shield"></i>
          <span>Papéis & Permissões</span>
        </router-link>
      </div>
      
      <div class="nav-section">
        <div class="nav-section-title">Configurações Avançadas</div>
        <router-link to="/agrupadores" class="nav-item">
          <i class="fas fa-layer-group"></i>
          <span>Agrupadores</span>
        </router-link>
        <router-link to="/vincular-func-permissoes" class="nav-item">
          <i class="fas fa-puzzle-piece"></i>
          <span>Funcionalidades & Permissões</span>
        </router-link>
      </div>

    </div>
    <!-- Toggle button at the bottom -->
    <button 
      class="toggle-button" 
      @click="toggleCollapse" 
      :title="isCollapsed ? 'Expandir menu' : 'Recolher menu'"
    >
      <i :class="isCollapsed ? 'fas fa-angle-right' : 'fas fa-angle-left'"></i>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'

const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebar_collapsed', isCollapsed.value.toString())
}

// helper para aplicar/remover title automaticamente em todos nav-items
const applyTitlesForCollapsedState = () => {
  const navItems = document.querySelectorAll('.sidebar .nav-item')
  navItems.forEach((item) => {
    const textEl = item.querySelector('span')
    const label = textEl?.textContent?.trim() || ''
    if (isCollapsed.value && label) {
      item.setAttribute('title', label)
    } else {
      item.removeAttribute('title')
    }
  })
}

// Observa alterações no menu para garantir comportamento padrão em novos itens/seções
let menuObserver: MutationObserver | null = null

onMounted(() => {
  const savedCollapsed = localStorage.getItem('sidebar_collapsed')
  if (savedCollapsed !== null) {
    isCollapsed.value = savedCollapsed === 'true'
  }
  nextTick(() => {
    applyTitlesForCollapsedState()
    const menu = document.querySelector('.sidebar .nav-menu')
    if (menu && 'MutationObserver' in window) {
      menuObserver = new MutationObserver(() => {
        applyTitlesForCollapsedState()
      })
      menuObserver.observe(menu, { childList: true, subtree: true })
    }
  })
})

watch(isCollapsed, async () => {
  await nextTick()
  applyTitlesForCollapsedState()
})

onBeforeUnmount(() => {
  if (menuObserver) {
    menuObserver.disconnect()
    menuObserver = null
  }
})
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-height: 100vh;
  background: white;
  border-right: 1px solid var(--gray-100);
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.sidebar.collapsed {
  width: 56px;
}

.sidebar-header {
  padding: 1rem 0.5rem;
  border-bottom: 1px solid var(--gray-100);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  justify-content: flex-start;
  padding: 0.5rem 1rem;
}

.collapsed .logo {
  justify-content: center;
  padding: 0.35rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-radius: 8px;
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.collapsed .logo-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}

.logo-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--gray-900);
  white-space: nowrap;
  transition: all 0.5s ease;
}

.logo-text strong {
  color: var(--primary);
}

.collapsed .logo-text {
  display: none;
}

.nav-menu {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-section-title {
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-500);
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: var(--gray-700);
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: 42px;
  width: 100%;
}

.collapsed .nav-item {
  padding: 0.75rem;
  justify-content: center;
}

.nav-item:hover {
  background: var(--gray-50);
  color: var(--primary);
}

.nav-item.router-link-active {
  background: var(--primary-50);
  color: var(--primary);
  font-weight: 500;
}

.nav-item.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--primary);
}

.nav-item i {
  font-size: 1.125rem;
  width: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.collapsed .nav-item i {
  width: 1.5rem;
  margin: 0;
}

.collapsed .nav-item:hover i {
  transform: scale(1.15);
  color: var(--primary);
}

.nav-item span {
  font-size: 0.875rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.2;
  display: inline-block;
  overflow: hidden;
  flex: 1;
  opacity: 1;
  max-width: 200px;
  transform: translateX(0);
}

.collapsed .nav-item span {
  opacity: 0;
  max-width: 0;
  margin-left: 0;
  flex: none;
  white-space: nowrap;
  overflow: hidden;
  transform: translateX(-10px);
}

.collapsed .nav-item {
  gap: 0;
}

.toggle-button {
  position: sticky;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: white;
  border: 1px solid var(--gray-200);
  color: var(--gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;
  z-index: 10;
}

.toggle-button:hover {
  color: var(--primary);
  border-color: var(--primary-light);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateX(-50%) scale(1.05);
}

.toggle-button i {
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.toggle-button:hover i {
  transform: scale(1.1);
}

/* Tooltip styles */
.nav-item[title]:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 1000;
  margin-left: 0.5rem;
  pointer-events: none;
  opacity: 0;
  animation: fadeIn 0.2s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Adjust main content */
:deep(.main-content) {
  margin-left: 280px;
  transition: margin-left 0.3s ease;
}

.collapsed + :deep(.main-content) {
  margin-left: 56px;
}

/* Ajustes adicionais para estado colapsado */
.collapsed .nav-section-title {
  height: 0;
  padding: 0;
  opacity: 0;
  overflow: hidden;
}

.collapsed .nav-section {
  margin-bottom: 0.5rem;
}

.collapsed .nav-item {
  margin: 0.25rem 0;
}
</style>
