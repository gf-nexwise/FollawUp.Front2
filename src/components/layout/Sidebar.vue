<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">
          <i class="fas fa-rocket"></i>
        </div>
        <span>FOLLAW<strong>UP</strong></span>
      </div>
    </div>
    <div class="nav-menu">
      <div class="nav-section">
        <div class="nav-section-title">Gestão de Planos</div>
        <router-link to="/planos" class="nav-item">
          <i class="fas fa-layer-group"></i>
          <span>Planos</span>
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
  </nav>
</template>
