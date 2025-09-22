<template>
  <Modal
    :visible="true"
    :title="title"
    @close="$emit('close')"
    ref="modalRef"
  >
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label">Selecione</label>
        <select v-model="selectedItemId" class="form-control form-select" required>
          <option value="">-- Selecione um item --</option>
          <option
            v-for="item in availableItems"
            :key="item.id"
            :value="item.id"
          >
            {{ item.nome }}
          </option>
        </select>
      </div>
      <div v-if="showLimite" class="form-group">
        <label class="form-label">Limite (0 para ilimitado)</label>
        <input
          v-model.number="limite"
          type="number"
          class="form-control"
          min="0"
        >
      </div>
    </form>

    <template #footer>
      <button class="btn btn-secondary" @click="$emit('close')" :disabled="loading">
        Cancelar
      </button>
      <button class="btn btn-primary" @click="handleSubmit" :disabled="loading">
        Adicionar
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AddItemModal'
})
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Modal from '../common/Modal.vue'

interface AvailableItem {
  id: string
  nome: string
  key: string
  descricao: string
  limite?: number
  [key: string]: any
}

interface ModalRef {
  startLoading: (message: string) => void
  stopLoading: () => void
  showError: (message: string) => void
  showSuccess: (message: string) => void
}

const props = defineProps<{
  title?: string
  availableItems: AvailableItem[]
  showLimite?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', item: AvailableItem): void
  (e: 'close'): void
}>()

const modalRef = ref<ModalRef | null>(null)
const loading = ref(false)
const selectedItemId = ref<string>('')
const limite = ref(1)

onMounted(async () => {
  try {
    modalRef.value?.startLoading('Carregando itens disponíveis...')
    // Simula carregamento inicial
    await new Promise(resolve => setTimeout(resolve, 2000))
    modalRef.value?.stopLoading()
  } catch (error) {
    modalRef.value?.showError('Erro ao carregar itens')
    modalRef.value?.stopLoading()
  }
})

const handleSubmit = async () => {
  if (!selectedItemId.value) return
  
  try {
    modalRef.value?.startLoading('Adicionando item...')
    // Simula chamada à API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const selectedItem = props.availableItems.find(item => item.id === selectedItemId.value)
    if (!selectedItem) return
    
    const itemData = { ...selectedItem }
    
    if (props.showLimite) {
      itemData.limite = limite.value
    }
    
    modalRef.value?.showSuccess('Item adicionado com sucesso!')
    
    setTimeout(() => {
      emit('save', itemData)
      emit('close')
    }, 1000)

  } catch (error) {
    modalRef.value?.showError('Erro ao adicionar item')
  } finally {
    modalRef.value?.stopLoading()
  }
}


</script>
