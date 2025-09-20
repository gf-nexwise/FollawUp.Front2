import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
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

const routes: RouteRecordRaw[] = [
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

export default router