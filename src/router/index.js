import { createRouter, createWebHistory } from 'vue-router'
import Direitos from '@/views/Direitos.vue'
import Funcionalidades from '@/views/Funcionalidades.vue'
import Papeis from '@/views/Papeis.vue'
import Permissoes from '@/views/Permissoes.vue'
import Planos from '@/views/Planos.vue'
import Precos from '@/views/Precos.vue'
import Quotas from '@/views/Quotas.vue'
import VincularPapeisPermissoes from '@/views/VincularPapeisPermissoes.vue'
import Agrupadores from '@/views/Agrupadores.vue'
import VincularFuncPermissoes from '@/views/VincularFuncPermissoes.vue'
import Login from '@/views/Login.vue'
import EsqueciSenha from '@/views/EsqueciSenha.vue'
import RedefinirSenha from '@/views/RedefinirSenha.vue'
import { authService } from '@/services/authService'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true }
  },
  {
    path: '/esqueci-senha',
    name: 'EsqueciSenha',
    component: EsqueciSenha,
    meta: { public: true }
  },
  {
    path: '/redefinir-senha/:token',
    name: 'RedefinirSenha',
    component: RedefinirSenha,
    meta: { public: true }
  },
  {
    path: '/',
    redirect: '/direitos'
  },
  {
    path: '/direitos',
    name: 'Direitos',
    component: Direitos
  },
  {
    path: '/funcionalidades',
    name: 'Funcionalidades',
    component: Funcionalidades
  },
  {
    path: '/papeis',
    name: 'Papeis',
    component: Papeis
  },
  {
    path: '/permissoes',
    name: 'Permissoes',
    component: Permissoes
  },
  {
    path: '/planos',
    name: 'Planos',
    component: Planos
  },
  {
    path: '/precos',
    name: 'Precos',
    component: Precos
  },
  {
    path: '/quotas',
    name: 'Quotas',
    component: Quotas
  },
  {
    path: '/vincular-papeis-permissoes',
    name: 'VincularPapeisPermissoes',
    component: VincularPapeisPermissoes
  },
  {
    path: '/agrupadores',
    name: 'Agrupadores',
    component: Agrupadores
  },
  {
    path: '/vincular-func-permissoes',
    name: 'VincularFuncPermissoes',
    component: VincularFuncPermissoes
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isPublicRoute = to.matched.some(record => record.meta.public)
  const isAuthenticated = authService.isAuthenticated()

  if (!isPublicRoute && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (isAuthenticated && to.name === 'Login') {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router