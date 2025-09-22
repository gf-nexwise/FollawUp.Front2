<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-shield-alt"></i> Permissões</h3>
        <div class="card-tools"></div>
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
          :actions="['view']"
          @view="visualizarDetalhe"
          @page-change="handlePageChange"
          @sort="handleSort"
          @update:items-per-page="handleItemsPerPage"
        />
      </div>
    </div>

    <FormModal
      v-if="showForm"
      :title="getModalTitle"
      :mode="modalMode"
      :loading="loadingModal"
      @close="hideFormHandler"
    >
      <form>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nome</label>
            <input v-model="formData.nome" type="text" class="form-control" disabled>
          </div>
          <div class="form-group">
            <label class="form-label">Key</label>
            <input v-model="formData.key" type="text" class="form-control" disabled>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <input v-model="formData.descricao" type="text" class="form-control" disabled>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" v-model="formData.ativo" disabled>
            <label class="form-check-label">Ativo</label>
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

import { PermissoesService } from '@/modules/controle-acesso/permissoes/services/PermissoesService'
import type { IPermissao } from '@/modules/controle-acesso/permissoes/types'

const { showNotification } = useNotification()
const permissoesService = PermissoesService.getInstance()

// Estado do componente
const permissoes = ref<IPermissao[]>([])
const loading = ref<boolean>(false)
const showForm = ref<boolean>(false)
const modalMode = ref<'view'>('view')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalItems = ref<number>(0)
const currentSort = ref<SortInfo>({ field: 'nome', direction: 'asc' })
const formData = ref<IPermissao>({} as IPermissao)

// Estado separado para loading do modal
const loadingModal = ref(false)

// Computed para título do modal
const getModalTitle = computed(() => 'Detalhes da Permissão')

// Definição das colunas
const columns = ref<Column[]>([
  { field: 'nome', label: 'Nome', width: '40%', sortable: true },
  { field: 'key', label: 'Key', width: '35%', sortable: true },
  { field: 'ativo', label: 'Status', type: 'status', width: '25%', sortable: true }
])

const loadPermissaoAndShowModal = async (item: IPermissao) => {
  try {
    loadingModal.value = true;
    const response = await permissoesService.buscarPorId(item.id.toString());
    formData.value = { ...response.data };
    modalMode.value = 'view';
    showForm.value = true;
  } catch (error) {
    console.error('Erro ao carregar detalhes da permissão:', error);
    showNotification({
      type: 'error',
      message: 'Erro ao carregar detalhes da permissão. Tente novamente mais tarde.',
    });
  } finally {
    loadingModal.value = false;
  }
}

// Função para visualizar detalhes
const visualizarDetalhe = (item: IPermissao) => loadPermissaoAndShowModal(item);

// Função para fechar o modal
const hideFormHandler = () => {
  showForm.value = false;
  formData.value = {} as IPermissao;
  modalMode.value = 'view';
}

const handleSort = (sort: SortInfo): void => {
  currentSort.value = sort;
  loadPermissoes();
}

const handlePageChange = (page: number): void => {
  currentPage.value = page;
  loadPermissoes();
}

const handleItemsPerPage = (value: number): void => {
  pageSize.value = value;
  currentPage.value = 1;
  loadPermissoes();
}

const loadPermissoes = async (): Promise<void> => {
  try {
    loading.value = true;
    const response = await permissoesService.listarPaginado({
      page: currentPage.value,
      pageSize: pageSize.value,
      sortField: currentSort.value.field || 'nome',
      sortDirection: currentSort.value.direction || 'asc'
    });
    
    permissoes.value = response.items;
    totalItems.value = response.totalItems;
  } catch (error) {
    console.error('Erro ao carregar permissões:', error);
    showNotification({
      type: 'error',
      message: 'Erro ao carregar permissões. Tente novamente mais tarde.',
    });
  } finally {
    loading.value = false;
  }
}

// Set up mounted hook
onMounted(loadPermissoes);
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

.form-row .col {
  flex: 1;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
}

.permissao-details {
  display: grid;
  gap: 1rem;
  padding: 0.5rem;
}

.permissao-details strong {
  font-weight: 600;
  color: var(--text-secondary, #666);
  margin-right: 0.5rem;
}
</style>