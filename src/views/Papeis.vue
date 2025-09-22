<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-user-tag"></i> Papéis
        </h3>
        <div class="card-tools">
          <button type="button" class="btn btn-primary" @click="showFormHandler()">
            <i class="fas fa-plus"></i> Novo Papel
          </button>
        </div>
      </div>
      <div class="card-body">
        <PaginatedGrid
          :items="papeis"
          :columns="columns"
          :loading="loading"
          :loading-text="'Carregando...'"
          :current-page="currentPage"
          :total-pages="Math.ceil(totalItems / pageSize)"
          :total-items="totalItems"
          :items-per-page="pageSize"
          :sort="currentSort"
          :actions="['edit', 'view']"
          @view="visualizarDetalhe"
          @edit="showFormHandler"
          @page-change="handlePageChange"
          @sort="handleSort"
          @update:items-per-page="handleItemsPerPage"
        />
      </div>
    </div>

    <FormModal
      v-if="showForm"
      :title="getModalTitle"
      :mode="formMode"
      :loading="loadingModal"
      @close="hideFormHandler"
      @save="handleSubmit"
    >
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nome do Papel</label>
            <input v-model="formData.nome" type="text" class="form-control" :disabled="formMode === 'view'" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <input v-model="formData.descricao" type="text" class="form-control" :disabled="formMode === 'view'">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Status</label>
            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                v-model="formData.ativo"
                :disabled="formMode === 'view'"
              />
              <label class="form-check-label">Ativo</label>
            </div>
          </div>
        </div>
        <div v-if="formMode === 'view' && formData.permissions" class="form-row">
          <div class="form-group">
            <label class="form-label">Permissões Vinculadas</label>
            <ul class="permissions-list">
              <li v-for="permission in formData.permissions" :key="permission.id">
                {{ permission.nome }} ({{ permission.key }})
              </li>
            </ul>
          </div>
        </div>
      </form>
    </FormModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FormModal from '@/components/modals/FormModal.vue'
import PaginatedGrid from '@/components/ui/Grid/PaginatedGrid.vue'
import { useNotification } from '@/composables/useNotification'
import type { Column } from '@/types/grid'
import type { SortInfo } from '@/types/api/base/filters'
import { PapeisService } from '@/modules/controle-acesso/papeis/services/PapeisService'
import type { IPapelBase } from '@/modules/controle-acesso/papeis/types'
import type { IUpsertRoleRequest, IRoleDetalheDto } from '@/modules/controle-acesso/papeis/types/dtos'

const { showNotification } = useNotification()
const papeisService = PapeisService.getInstance()

// Estado do componente
const papeis = ref<IPapelBase[]>([])
const loading = ref<boolean>(false)
const showForm = ref<boolean>(false)
const loadingModal = ref<boolean>(false)
const currentPage = ref<number>(1)
const formMode = ref<'edit' | 'view'>('edit')
const formData = ref<IUpsertRoleRequest & Partial<IRoleDetalheDto>>({
  nome: '',
  descricao: '',
  ativo: true
})
const pageSize = ref<number>(10)
const totalItems = ref<number>(0)
const currentSort = ref<SortInfo>({ field: 'nome', direction: 'asc' })

// Computed para título do modal
const getModalTitle = computed(() => {
  if (formMode.value === 'view') return 'Detalhes do Papel'
  return formData.value.id ? 'Editar Papel' : 'Novo Papel'
})

// Definição das colunas
const columns = ref<Column[]>([
  { field: 'nome', label: 'Nome', width: '40%', sortable: true },
  { field: 'descricao', label: 'Descrição', width: '35%', sortable: true },
  { field: 'ativo', label: 'Status', type: 'status', width: '25%', sortable: true }
])

// Função para visualizar detalhes
const visualizarDetalhe = async (item: IPapelBase) => {
  try {
    loadingModal.value = true
    formMode.value = 'view'
    const response = await papeisService.buscarPorId(item.id)
    formData.value = response
    showForm.value = true
  } catch (error) {
    console.error('Erro ao carregar detalhes do papel:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao carregar detalhes do papel. Tente novamente mais tarde.'
    })
  } finally {
    loadingModal.value = false
  }
}

// Função para abrir formulário
const showFormHandler = (papel?: IPapelBase) => {
  formMode.value = 'edit'
  if (papel) {
    formData.value = { ...papel }
  } else {
    formData.value = {
      nome: '',
      descricao: '',
      ativo: true
    }
  }
  showForm.value = true
}

// Função para fechar o modal
const hideFormHandler = () => {
  showForm.value = false
  formData.value = {
    nome: '',
    descricao: '',
    ativo: true
  }
}

// Função para submeter o formulário
const handleSubmit = async () => {
  try {
    loadingModal.value = true
    await papeisService.upsert(formData.value)
    hideFormHandler()
    loadPapeis()
    showNotification({
      type: 'success',
      message: `Papel ${formData.value.id ? 'atualizado' : 'criado'} com sucesso!`
    })
  } catch (error) {
    console.error('Erro ao salvar papel:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao salvar papel. Tente novamente mais tarde.'
    })
  } finally {
    loadingModal.value = false
  }
}

const handleSort = (sort: SortInfo): void => {
  currentSort.value = sort
  loadPapeis()
}

const handlePageChange = (page: number): void => {
  currentPage.value = page
  loadPapeis()
}

const handleItemsPerPage = (value: number): void => {
  pageSize.value = value
  currentPage.value = 1
  loadPapeis()
}

const loadPapeis = async (): Promise<void> => {
  try {
    loading.value = true
    const response = await papeisService.listarPaginado({
      page: currentPage.value,
      pageSize: pageSize.value,
      sortField: currentSort.value.field || 'nome',
      sortDirection: currentSort.value.direction || 'asc'
    })
    
    papeis.value = response.items
    totalItems.value = response.totalItems
  } catch (error) {
    console.error('Erro ao carregar papéis:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao carregar papéis. Tente novamente mais tarde.'
    })
  } finally {
    loading.value = false
  }
}

onMounted(loadPapeis)
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.card-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-tools {
  display: flex;
  gap: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  flex: 1;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
}

.permissions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.permissions-list li {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.permissions-list li:last-child {
  border-bottom: none;
}
</style>