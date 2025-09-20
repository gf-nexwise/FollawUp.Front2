<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-layer-group"></i> Agrupadores
        </h3>
        <button type="button" class="btn btn-primary" @click="showFormHandler()">
          <i class="fas fa-plus"></i> Novo Agrupador
        </button>
      </div>
      <div class="card-body">
        <div class="tabs">
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'FUNCIONALIDADE' }"
            @click="activeTab = 'FUNCIONALIDADE'"
          >
            Funcionalidades
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'PERMISSAO' }"
            @click="activeTab = 'PERMISSAO'"
          >
            Permissões
          </button>
        </div>

        <PaginatedGrid
          :items="filteredAgrupadores"
          :columns="columns"
          :loading="loading"
          :loading-text="'Carregando...'"
          @edit="showFormHandler"
          @delete="deleteAgrupador"
        />
      </div>
    </div>

    <FormModal
      v-if="showForm"
      :title="isEditing ? 'Editar Agrupador' : 'Novo Agrupador'"
      @close="hideFormHandler"
      @save="handleSubmit"
    >
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Nome do Agrupador</label>
          <input v-model="formData.nome" type="text" class="form-control" required>
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <input v-model="formData.descricao" type="text" class="form-control">
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select v-model="formData.ativo" class="form-control form-select">
            <option :value="true">Ativo</option>
            <option :value="false">Inativo</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Tipo</label>
          <select v-model="formData.tipo" class="form-control form-select" required>
            <option value="FUNCIONALIDADE">Funcionalidade</option>
            <option value="PERMISSAO">Permissão</option>
          </select>
        </div>
      </form>
    </FormModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import FormModal from '@/components/modals/FormModal.vue'
import PaginatedGrid from '@/components/ui/DataGrid/PaginatedGrid.vue'
import agrupadoresService from '@/services/agrupadoresService'
import { useNotification } from '@/composables/useNotification'

const { showNotification } = useNotification()

const columns = [
  { field: 'nome', label: 'Nome' },
  { field: 'descricao', label: 'Descrição' },
  { field: 'ativo', label: 'Status', type: 'status', width: '120px' },
  { type: 'actions', label: 'Ações', width: '100px' }
]

const agrupadores = ref([])
const loading = ref(false)
const showForm = ref(false)
const isEditing = ref(false)
const activeTab = ref('FUNCIONALIDADE')

// Carrega os agrupadores quando o componente é montado ou quando a tab muda
const loadAgrupadores = async () => {
  try {
    loading.value = true
    agrupadores.value = await agrupadoresService.listar(activeTab.value)
  } catch (error) {
    console.error('Erro ao carregar agrupadores:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao carregar agrupadores. Tente novamente mais tarde.'
    })
  } finally {
    loading.value = false
  }
}

// Watch para recarregar quando mudar a tab
watch(activeTab, loadAgrupadores)

// Carrega os dados iniciais
onMounted(loadAgrupadores)

const formData = ref({
  id: null,
  nome: '',
  descricao: '',
  tipo: 'FUNCIONALIDADE',
  ativo: true
})

const filteredAgrupadores = computed(() => {
  return agrupadores.value.filter(a => a.tipo === activeTab.value)
})

const showFormHandler = (agrupador = null) => {
  showForm.value = true
  if (agrupador) {
    isEditing.value = true
    formData.value = { ...agrupador }
  } else {
    isEditing.value = false
    formData.value = {
      id: null,
      nome: '',
      descricao: '',
      tipo: activeTab.value,
      ativo: true
    }
  }
}

const hideFormHandler = () => {
  showForm.value = false
  isEditing.value = false
  formData.value = {
    id: null,
    nome: '',
    descricao: '',
    tipo: activeTab.value,
    ativo: true
  }
}

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await agrupadoresService.atualizar(formData.value.id, formData.value)
      showNotification({
        type: 'success',
        message: 'Agrupador atualizado com sucesso!'
      })
    } else {
      await agrupadoresService.criar(formData.value)
      showNotification({
        type: 'success',
        message: 'Agrupador criado com sucesso!'
      })
    }
    await loadAgrupadores()
    hideFormHandler()
  } catch (error) {
    console.error('Erro ao salvar agrupador:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao salvar agrupador. Tente novamente mais tarde.'
    })
  }
}

const deleteAgrupador = async (item) => {
  if (confirm('Tem certeza que deseja excluir este agrupador?')) {
    try {
      await agrupadoresService.excluir(item.id, activeTab.value)
      showNotification({
        type: 'success',
        message: 'Agrupador excluído com sucesso!'
      })
      await loadAgrupadores()
    } catch (error) {
      console.error('Erro ao excluir agrupador:', error)
      showNotification({
        type: 'error',
        message: 'Erro ao excluir agrupador. Tente novamente mais tarde.'
      })
    }
  }
}
</script>

<style scoped>
.tabs {
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.tab-button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.7;
  border-bottom: 2px solid transparent;
}

.tab-button.active {
  opacity: 1;
  border-bottom-color: var(--primary);
  font-weight: 500;
}

.tab-button:hover {
  opacity: 1;
}
</style>