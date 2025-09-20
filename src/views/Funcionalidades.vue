<template>
  <div>
    <div class="master-detail">
      <div class="master-panel">
        <div class="panel-header">
          <h3 class="panel-title">
            <i class="fas fa-layer-group"></i> Planos
          </h3>
        </div>
        <div class="panel-body">
          <ul class="plan-list">
            <li
              v-for="plan in planos"
              :key="plan.id"
              :class="['plan-item', { active: selectedPlan && selectedPlan.id === plan.id }]"
              @click="selectPlan(plan)"
            >
              <div class="plan-info">
                <h4>{{ plan.nome }}</h4>
                <p>{{ plan.descricao }}</p>
              </div>
              <span :class="['status-badge', plan.ativo ? 'active' : 'inactive']">
                {{ plan.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="detail-panel">
        <div class="panel-header">
          <h3 class="panel-title">
            <i class="fas fa-puzzle-piece"></i> Funcionalidades
          </h3>
          <button
            v-if="selectedPlan"
            class="btn btn-primary btn-sm"
            @click="showAddItemModal"
          >
            <i class="fas fa-plus"></i> Adicionar
          </button>
        </div>
        <div class="panel-body">
          <div v-if="!selectedPlan" class="empty-state">
            <i class="fas fa-mouse-pointer"></i>
            <h3>Selecione um Plano</h3>
            <p>Escolha um plano à esquerda para gerenciar funcionalidades.</p>
          </div>
          
          <div v-else>
            <div class="detail-header">
              <div>
                <div class="breadcrumb">
                  <span>{{ selectedPlan.nome }}</span>
                  <i class="fas fa-chevron-right"></i>
                  <span>Funcionalidades</span>
                </div>
                <h2 class="detail-title">Gerenciar Funcionalidades</h2>
              </div>
            </div>
            
            <div v-if="!selectedPlan.funcionalidades || selectedPlan.funcionalidades.length === 0" class="empty-state">
              <i class="fas fa-puzzle-piece"></i>
              <h3>Nenhuma funcionalidade configurada.</h3>
            </div>
            
            <div v-else class="items-list">
              <div
                v-for="funcionalidade in selectedPlan.funcionalidades"
                :key="funcionalidade.id"
                class="item-row"
              >
                <div class="item-info">
                  <div class="item-title">{{ funcionalidade.nome }}</div>
                  <div v-if="funcionalidade.quota" class="item-subtitle">
                    Quota: {{ funcionalidade.quota.tipo }} - {{ funcionalidade.quota.limite === 0 ? 'Ilimitado' : funcionalidade.quota.limite }}
                  </div>
                </div>
                <div class="item-actions">
                  <button
                    class="btn btn-danger btn-sm"
                    @click="removeItem(funcionalidade.id)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AddItemModal
      v-if="showModal"
      title="Adicionar Funcionalidade"
      :available-items="availableItems"
      @save="handleAddItem"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AddItemModal from '@/components/modals/AddItemModal.vue'

const planos = ref([
  {
    id: 1,
    nome: "Plano Básico",
    descricao: "Ideal para equipes pequenas.",
    tipoEntidade: "organizacao",
    ativo: true,
    dataInicio: "2024-01-01",
    dataFim: null,
    isPublico: true,
    precos: [],
    direitos: [],
    funcionalidades: [
      { id: 1, nome: "Incluir processo", quota: null },
      { id: 2, nome: "Alterar processo", quota: null },
    ],
  },
  {
    id: 2,
    nome: "Plano Profissional",
    descricao: "Para empresas em crescimento.",
    tipoEntidade: "estabelecimento",
    ativo: true,
    dataInicio: "2024-01-01",
    dataFim: null,
    isPublico: true,
    precos: [],
    direitos: [],
    funcionalidades: [
      { id: 1, nome: "Incluir processo", quota: null },
      { id: 4, nome: "Gerar relatórios", quota: { tipo: "Mensal", limite: 50 } },
    ],
  },
])

const availableFuncionalidades = ref([
  { id: 1, nome: "Incluir processo" },
  { id: 2, nome: "Alterar processo" },
  { id: 3, nome: "Excluir processo" },
  { id: 4, nome: "Gerar relatórios" },
  { id: 5, nome: "Gerenciar usuários" },
  { id: 6, nome: "Adicionar partes (autores, réus)" },
  { id: 7, nome: "Alterar situação do processo" },
  { id: 8, nome: "Integração API" },
])

const selectedPlan = ref(null)
const showModal = ref(false)

const availableItems = computed(() => {
  if (!selectedPlan.value) return []
  return availableFuncionalidades.value.filter(item => 
    !selectedPlan.value.funcionalidades?.some(existing => existing.id === item.id)
  )
})

const selectPlan = (plan) => {
  selectedPlan.value = plan
}

const showAddItemModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleAddItem = (itemData) => {
  const newItem = { ...itemData, quota: null }
  selectedPlan.value.funcionalidades.push(newItem)
  closeModal()
}

const removeItem = (itemId) => {
  if (confirm('Remover este item?')) {
    selectedPlan.value.funcionalidades = selectedPlan.value.funcionalidades.filter(item => item.id !== itemId)
  }
}

onMounted(() => {
  // Component mounted
})
</script>
