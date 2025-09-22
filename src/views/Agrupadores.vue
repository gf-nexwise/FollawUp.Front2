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
            :class="{ active: activeTab === TipoAgrupador.FUNCIONALIDADE }"
            @click="activeTab = TipoAgrupador.FUNCIONALIDADE"
          >
            Funcionalidades
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === TipoAgrupador.PERMISSAO }"
            @click="activeTab = TipoAgrupador.PERMISSAO"
          >
            Permissões
          </button>
        </div>

        <PaginatedGrid
          :items="agrupadores"
          :columns="columns"
          :loading="loading"
          :loading-text="'Carregando...'"
          :current-page="currentPage"
          :total-pages="Math.ceil(totalItems / pageSize)"
          :total-items="totalItems"
          :items-per-page="pageSize"
          :sort="currentSort"
          @edit="showFormHandler"
          @delete="deleteAgrupador"
          @page-change="handlePageChange"
          @sort="handleSort"
          @update:items-per-page="handleItemsPerPage"
        />
      </div>
    </div>

    <FormModal
      v-if="showForm"
      :title="isEditing ? 'Editar Agrupador' : 'Novo Agrupador'"
      :mode="isEditing ? 'edit' : 'add'"
      :loading="loading"
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
            <option :value="TipoAgrupador.FUNCIONALIDADE">Funcionalidade</option>
            <option :value="TipoAgrupador.PERMISSAO">Permissão</option>
          </select>
        </div>
      </form>
    </FormModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import FormModal from '@/components/modals/FormModal.vue'
import PaginatedGrid from '@/components/ui/Grid/PaginatedGrid.vue'
import { useNotification } from '@/composables/useNotification'
import type { Column } from '@/types/grid'
import type { AgrupadorFilter } from '@/types/api/agrupadores/filters'
import type { PagedResponse } from '@/types/api/base/responses'
import type { SortInfo } from '@/types/api/base/filters'

// Importações do módulo de agrupadores
import { agrupadoresService, TipoAgrupador } from '@/modules/agrupadores'
import type { IAgrupador } from '@/modules/agrupadores'

const { showNotification } = useNotification()

const columns: Column[] = [
  { field: 'nome', label: 'Nome' },
  { field: 'descricao', label: 'Descrição' },
  { field: 'ativo', label: 'Status', type: 'status', width: '120px' },
  { type: 'actions', label: 'Ações', width: '100px' }
]

const agrupadores = ref<IAgrupador[]>([])
const loading = ref<boolean>(false)
const showForm = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const activeTab = ref<TipoAgrupador>(TipoAgrupador.FUNCIONALIDADE)
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalItems = ref<number>(0)
const currentSort = ref<SortInfo>({ field: 'nome', direction: 'asc' })

interface FormData extends Omit<IAgrupador, 'id'> {
  id: number | null;
}

const formData = ref<FormData>({
  id: null,
  nome: '',
  descricao: '',
  tipo: TipoAgrupador.FUNCIONALIDADE,
  ativo: true
})

// Define loadAgrupadores function first
const showFormHandler = (agrupador: IAgrupador | null = null): void => {
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

const hideFormHandler = (): void => {
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

const handleSubmit = async (): Promise<void> => {
  try {
    const { id, ...agrupadoresData } = formData.value
    
    if (isEditing.value && id !== null) {
      await agrupadoresService.atualizar(id, agrupadoresData)
      showNotification({
        type: 'success',
        message: 'Agrupador atualizado com sucesso!'
      })
    } else {
      await agrupadoresService.criar(agrupadoresData)
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

const handleSort = (sort: SortInfo): void => {
  currentSort.value = sort;
}

const handlePageChange = (page: number): void => {
  currentPage.value = page;
}

const handleItemsPerPage = (value: number): void => {
  pageSize.value = value;
  currentPage.value = 1;
  loadAgrupadores();
}

const loadAgrupadores = async (): Promise<void> => {
  try {
    console.log('Iniciando carregamento de agrupadores')
    loading.value = true
    console.log('Estado atual:', { 
      activeTab: activeTab.value, 
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      currentSort: currentSort.value
    })
    const response = await agrupadoresService.listarPaginado({
      page: currentPage.value,
      pageSize: pageSize.value,
      sortField: currentSort.value?.field,
      sortDirection: currentSort.value?.direction,
      tipo: activeTab.value
    })
    console.log('Resposta recebida:', response)
    agrupadores.value = response.items
    totalItems.value = response.totalItems
    console.log('Estado atualizado:', { 
      agrupadores: agrupadores.value, 
      totalItems: totalItems.value 
    })
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

// Set up watchers and mounted hook after function is defined
watch([activeTab, currentPage, currentSort], loadAgrupadores)
onMounted(loadAgrupadores)

const deleteAgrupador = async (item: IAgrupador): Promise<void> => {
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