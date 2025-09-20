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
              :class="['plan-item', { active: selectedPlan?.id === plan.id }]"
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
            <i class="fas fa-shield-alt"></i> Direitos & Limites
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
            <p>Escolha um plano à esquerda para gerenciar direitos e limites.</p>
          </div>
          
          <div v-else>
            <div class="detail-header">
              <div>
                <div class="breadcrumb">
                  <span>{{ selectedPlan.nome }}</span>
                  <i class="fas fa-chevron-right"></i>
                  <span>Direitos</span>
                </div>
                <h2 class="detail-title">Gerenciar Direitos</h2>
              </div>
            </div>
            
            <div v-if="selectedPlan.direitos?.length === 0" class="empty-state">
              <i class="fas fa-shield-alt"></i>
              <h3>Nenhum direito configurado.</h3>
            </div>
            
            <div v-else class="items-list">
              <div
                v-for="direito in selectedPlan.direitos"
                :key="direito.id"
                class="item-row"
              >
                <div class="item-info">
                  <div class="item-title">{{ direito.nome }}</div>
                </div>
                <div class="item-actions">
                  <span class="item-value">
                    {{ direito.limite === 0 ? 'Ilimitado' : direito.limite }}
                  </span>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="removeItem(direito.id)"
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
      title="Adicionar Direito"
      :available-items="availableItems"
      :show-limite="true"
      @save="handleAddItem"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlanos } from '@/composables/usePlanos'
import AddItemModal from '@/components/modals/AddItemModal.vue'

const { planos, selectedPlano: selectedPlan, availableDireitos, loadPlanos, addItemToPlano, removeItemFromPlano } = usePlanos()

const showModal = ref(false)

const availableItems = computed(() => {
  if (!selectedPlan?.value) return []
  return availableDireitos.value.filter(item => 
    !selectedPlan.value.direitos?.some(existing => existing.id === item.id)
  )
})

const selectPlan = (plan) => {
  if (!plan) return
  selectedPlan.value = { ...plan }
}

const showAddItemModal = () => {
  if (!selectedPlan?.value) return
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleAddItem = async (itemData) => {
  try {
    await addItemToPlano(selectedPlan.value.id, 'Direitos', itemData)
    closeModal()
  } catch (error) {
    console.error('Error adding item:', error)
  }
}

const removeItem = async (itemId) => {
  if (confirm('Remover este item?')) {
    try {
      await removeItemFromPlano(selectedPlan.value.id, 'Direitos', itemId)
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }
}

onMounted(() => {
  loadPlanos()
})
</script>
