<template>
  <Modal
    :visible="true"
    title="Editar Preço"
    @close="$emit('close')"
    ref="modalRef"
  >
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label">Recorrência</label>
        <input
          :value="price.recorrencia"
          type="text"
          class="form-control"
          disabled
        >
      </div>
      <div class="form-group">
        <label class="form-label">Novo Valor (BRL)</label>
        <input
          v-model.number="formData.valor"
          type="number"
          class="form-control"
          step="0.01"
          min="0"
          required
        >
      </div>
    </form>

    <template #footer>
      <button class="btn btn-secondary" @click="$emit('close')" :disabled="loading">
        Cancelar
      </button>
      <button class="btn btn-primary" @click="handleSubmit" :disabled="loading">
        Salvar
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Modal from '../common/Modal.vue'

const props = defineProps({
  price: Object,
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'close'])
const modalRef = ref(null)
const loading = ref(false)

const formData = ref({
  valor: 0
})

// Simula carregamento inicial dos dados
onMounted(async () => {
  try {
    modalRef.value?.startLoading('Carregando dados do preço...')
    // Simula chamada à API com delay maior para visualização
    await new Promise(resolve => setTimeout(resolve, 2500))
    formData.value.valor = props.price.valor
    modalRef.value?.stopLoading()
  } catch (error) {
    modalRef.value?.showError('Erro ao carregar dados do preço')
    modalRef.value?.stopLoading()
  }
})

const handleSubmit = async () => {
  try {
    modalRef.value?.startLoading('Salvando alterações...')
    
    // Simula chamada à API com delay maior para visualização
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const updatedPrice = {
      ...props.price,
      valor: formData.value.valor
    }

    modalRef.value?.showSuccess('Preço atualizado com sucesso!')
    
    // Aguarda a animação do feedback antes de fechar
    setTimeout(() => {
      emit('save', updatedPrice)
      emit('close')
    }, 1000)

  } catch (error) {
    modalRef.value?.showError('Erro ao salvar alterações')
  } finally {
    modalRef.value?.stopLoading()
  }
}
</script>
