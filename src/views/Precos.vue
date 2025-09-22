<template>
  <div>
    <MasterDetailPanel
      :items="planos"
      :selected-item="selectedPlan"
      :loading="loading"
      master-title="Planos"
      master-icon="fas fa-layer-group"
      detail-title="Preços"
      detail-icon="fas fa-dollar-sign"
      empty-state-title="Selecione um Plano"
      empty-state-description="Escolha um plano à esquerda para gerenciar preços."
      detail-header-title="Gerenciar Preços"
      :show-add-button="false"
      :show-status="true"
      @select="selectPlan"
    >

      <template #detail-content>
        <div v-if="!selectedPlan.precos || selectedPlan.precos.length === 0" class="empty-state">
          <i class="fas fa-dollar-sign"></i>
          <h3>Nenhum preço configurado.</h3>
          <p>Use o formulário abaixo para adicionar preços.</p>
        </div>
        
        <div v-else class="items-list">
          <div
            v-for="preco in selectedPlan.precos"
            :key="preco.id"
            class="item-row"
          >
            <div class="item-info">
              <div class="item-title">{{ preco.recorrencia }}</div>
              <div class="item-subtitle">R$ {{ preco.valor.toFixed(2) }}</div>
            </div>
            <div class="item-actions">
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

        <div class="add-price-form">
          <h3>Adicionar Novo Preço</h3>
          <form @submit.prevent="handleAddPrice" class="form-grid">
            <div class="form-group">
              <label class="form-label">Recorrência</label>
              <select v-model="newPrice.recorrencia" class="form-control form-select" required>
                <option value="">Selecione...</option>
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
            <div class="form-group">
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
            <div class="form-group">
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-plus"></i> Adicionar
              </button>
            </div>
          </form>
        </div>
      </template>
    </MasterDetailPanel>

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
import MasterDetailPanel from '@/components/ui/MasterDetail/MasterDetailPanel.vue'
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
const loading = ref(false)
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

<style scoped>
.add-price-form {
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.add-price-form h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: flex-end;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary, #007bff);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary, #007bff);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark, #0056b3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.status-badge {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background: #ffebee;
  color: #c62828;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

.items-list {
  margin-top: 1rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
}

.item-row:hover {
  background: #f8f9fa;
  border-color: #ddd;
}

.item-info {
  flex: 1;
}

.item-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.item-subtitle {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.master-info h4 {
  margin: 0;
  font-size: 1rem;
}

.master-info p {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: #666;
}
</style>
