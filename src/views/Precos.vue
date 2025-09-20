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
            <i class="fas fa-dollar-sign"></i> Preços
          </h3>
        </div>
        <div class="panel-body">
          <div v-if="!selectedPlan" class="empty-state">
            <i class="fas fa-mouse-pointer"></i>
            <h3>Selecione um Plano</h3>
            <p>Escolha um plano à esquerda para gerenciar preços.</p>
          </div>
          
          <div v-else>
            <div class="detail-header">
              <div>
                <div class="breadcrumb">
                  <span>{{ selectedPlan.nome }}</span>
                  <i class="fas fa-chevron-right"></i>
                  <span>Preços</span>
                </div>
                <h2 class="detail-title">Gerenciar Preços</h2>
              </div>
            </div>
            
            <div v-if="!selectedPlan.precos || selectedPlan.precos.length === 0" class="empty-state">
              <i class="fas fa-dollar-sign"></i>
              <h3>Nenhum preço configurado.</h3>
            </div>
            
            <div v-else class="items-list">
              <div
                v-for="preco in selectedPlan.precos"
                :key="preco.id"
                class="item-row"
              >
                <div class="item-info">
                  <div class="item-title">{{ preco.recorrencia }}</div>
                </div>
                <div class="item-actions">
                  <span class="item-value">R$ {{ preco.valor.toFixed(2) }}</span>
                  <button
                    class="btn btn-secondary btn-sm"
                    @click="showEditPriceModal(preco)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="removePrice(preco.id)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <div style="margin-top: 2rem; border-top: 1px solid var(--gray-200); padding-top: 1.5rem;">
              <h3 style="margin-bottom: 1rem;">Adicionar Novo Preço</h3>
              <form @submit.prevent="handleAddPrice" class="form-grid" style="align-items: flex-end;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label">Recorrência</label>
                  <select v-model="newPrice.recorrencia" class="form-control form-select" required>
                    <option value="">Selecione...</option>
                    <option value="Mensal">Mensal</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label">Valor (BRL)</label>
                  <input
                    v-model.number="newPrice.valor"
                    type="number"
                    class="form-control"
                    placeholder="99.90"
                    step="0.01"
                    min="0"
                    required
                  >
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <button type="submit" class="btn btn-primary" style="width: 100%;">
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditPriceModal
      v-if="showModal"
      :price="selectedPrice"
      @save="handleEditPrice"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EditPriceModal from '@/components/modals/EditPriceModal.vue'

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
    precos: [
      { id: 1, recorrencia: "Mensal", valor: 39.9 },
      { id: 2, recorrencia: "Anual", valor: 399.0 },
    ],
    direitos: [],
    funcionalidades: [],
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
    precos: [
      { id: 3, recorrencia: "Mensal", valor: 99.9 },
      { id: 4, recorrencia: "Anual", valor: 999.0 },
    ],
    direitos: [],
    funcionalidades: [],
  },
])

const selectedPlan = ref(null)
const showModal = ref(false)
const selectedPrice = ref(null)
const newPrice = ref({
  recorrencia: '',
  valor: 0
})

const selectPlan = (plan) => {
  selectedPlan.value = plan
}

const showEditPriceModal = (price) => {
  selectedPrice.value = price
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPrice.value = null
}

const handleAddPrice = () => {
  if (!newPrice.value.recorrencia) {
    alert('Selecione uma recorrência.')
    return
  }

  const exists = selectedPlan.value.precos.some(p => p.recorrencia === newPrice.value.recorrencia)
  if (exists) {
    alert('Essa recorrência já existe para o plano.')
    return
  }

  const priceData = {
    id: Date.now(),
    recorrencia: newPrice.value.recorrencia,
    valor: parseFloat(newPrice.value.valor)
  }

  selectedPlan.value.precos.push(priceData)
  
  newPrice.value = {
    recorrencia: '',
    valor: 0
  }
}

const handleEditPrice = (updatedPrice) => {
  const index = selectedPlan.value.precos.findIndex(p => p.id === updatedPrice.id)
  if (index !== -1) {
    selectedPlan.value.precos[index] = updatedPrice
  }
  closeModal()
}

const removePrice = (priceId) => {
  if (confirm('Remover este preço?')) {
    selectedPlan.value.precos = selectedPlan.value.precos.filter(p => p.id !== priceId)
  }
}

onMounted(() => {
  // Component mounted
})
</script>
