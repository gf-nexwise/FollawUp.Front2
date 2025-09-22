<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-shield-alt"></i> Permissões Cadastradas
        </h3>
        <button type="button" class="btn btn-primary" @click="showFormHandler()">
          <i class="fas fa-plus"></i> Nova Permissão
        </button>
      </div>
      <div class="card-body">
        <PaginatedGrid
          :items="permissoes"
          :columns="columns"
          :loading="loading"
          :loading-text="'Carregando...'"
          :current-page="currentPage"
          :total-pages="Math.ceil(totalItems / pageSize)"
          :total-items="totalItems"
          :items-per-page="pageSize"
          :sort="currentSort"
          @edit="showFormHandler"
          @delete="deletePermissao"
          @page-change="handlePageChange"
          @sort="handleSort"
          @update:items-per-page="handleItemsPerPage"
        />
      </div>
    </div>

    <FormModal
      v-if="showForm"
      :title="isEditing ? 'Editar Permissão' : 'Nova Permissão'"
      @close="hideFormHandler"
      @save="handleSubmit"
    >
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nome</label>
            <input v-model="formData.nome" type="text" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Key</label>
            <input v-model="formData.key" type="text" class="form-control" required placeholder="recurso:acao">
          </div>
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
import type { SortInfo } from '@/types/api/base/filters'

import { PermissoesService } from '@/modules/controle-acesso/permissoes/services/PermissoesService'
import type { IPermissao } from '@/modules/controle-acesso/permissoes/types'

const { showNotification } = useNotification()
const permissoesService = PermissoesService.getInstance()

const columns: Column[] = [
  { field: 'nome', label: 'Nome', width: '30%' },
  { field: 'key', label: 'Key', width: '30%' },
  { field: 'ativo', label: 'Status', type: 'status', width: '20%' },
  { type: 'actions', label: 'Ações', width: '20%' }
]

const permissoes = ref<IPermissao[]>([])
const loading = ref<boolean>(false)
const showForm = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalItems = ref<number>(0)
const currentSort = ref<SortInfo>({ field: 'nome', direction: 'asc' })

interface FormData extends Omit<IPermissao, 'id'> {
  id: number | null;
}

const formData = ref<FormData>({
  id: null,
  nome: '',
  key: '',
  descricao: '',
  ativo: true
})

const showFormHandler = (permissao: IPermissao | null = null): void => {
  showForm.value = true
  if (permissao) {
    isEditing.value = true
    formData.value = { ...permissao }
  } else {
    isEditing.value = false
    formData.value = {
      id: null,
      nome: '',
      key: '',
      descricao: '',
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
    key: '',
    descricao: '',
    ativo: true
  }
}

const handleSubmit = async (): Promise<void> => {
  try {
    const { id, ...permissaoData } = formData.value
    
    if (isEditing.value && id !== null) {
      await permissoesService.atualizar(id, permissaoData)
      showNotification({
        type: 'success',
        message: 'Permissão atualizada com sucesso!'
      })
    } else {
      await permissoesService.criar(permissaoData)
      showNotification({
        type: 'success',
        message: 'Permissão criada com sucesso!'
      })
    }
    await loadPermissoes()
    hideFormHandler()
  } catch (error) {
    console.error('Erro ao salvar permissão:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao salvar permissão. Tente novamente mais tarde.'
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
  loadPermissoes();
}

const loadPermissoes = async (): Promise<void> => {
  try {
    loading.value = true
    const response = await permissoesService.listarPaginado({
      page: currentPage.value,
      pageSize: pageSize.value,
      sort: currentSort.value ? (currentSort.value.direction === 'desc' ? `-${currentSort.value.field}` : currentSort.value.field) : undefined
    })
    permissoes.value = response.items
    totalItems.value = response.totalItems
  } catch (error) {
    console.error('Erro ao carregar permissões:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao carregar permissões. Tente novamente mais tarde.'
    })
  } finally {
    loading.value = false
  }
}

const deletePermissao = async (item: IPermissao): Promise<void> => {
  if (confirm('Tem certeza que deseja excluir esta permissão?')) {
    try {
      await permissoesService.excluir(item.id)
      showNotification({
        type: 'success',
        message: 'Permissão excluída com sucesso!'
      })
      await loadPermissoes()
    } catch (error) {
      console.error('Erro ao excluir permissão:', error)
      showNotification({
        type: 'error',
        message: 'Erro ao excluir permissão. Tente novamente mais tarde.'
      })
    }
  }
}

// Set up watchers and mounted hook
watch([currentPage, currentSort], loadPermissoes)
onMounted(loadPermissoes)
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
</style>