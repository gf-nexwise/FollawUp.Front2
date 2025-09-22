<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-puzzle-piece"></i> Funcionalidades</h3>
        <div class="card-tools">
          <button class="btn btn-primary" @click="showAddModal">
            <i class="fas fa-plus"></i> Nova Funcionalidade
          </button>
        </div>
      </div>
      <div class="card-body">
        <PaginatedGrid
          :items="funcionalidades"
          :columns="columns"
          :loading="loading"
          :loading-text="'Carregando...'"
          :current-page="currentPage"
          :total-pages="Math.ceil(totalItems / pageSize)"
          :total-items="totalItems"
          :items-per-page="pageSize"
          :sort="currentSort"
          :actions="['view', 'edit']"
          @view="visualizarDetalhe"
          @edit="showEditModal"
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
      @save="handleSave"
    >
      <form>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nome</label>
            <input v-model="formData.nome" type="text" class="form-control" :disabled="modalMode === 'view'" />
          </div>
          <div class="form-group">
            <label class="form-label">Categoria</label>
            <input v-model="formData.categoria" type="text" class="form-control" :disabled="modalMode === 'view'" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <input v-model="formData.descricao" type="text" class="form-control" :disabled="modalMode === 'view'" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tipo de Limite</label>
            <input v-model="formData.tipoLimite" type="text" class="form-control" :disabled="modalMode === 'view'" />
          </div>
          <div class="form-group">
            <label class="form-label">Unidade de Medida</label>
            <input v-model="formData.unidadeMedida" type="text" class="form-control" :disabled="modalMode === 'view'" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Ordem</label>
            <input v-model.number="formData.ordem" type="number" class="form-control" :disabled="modalMode === 'view'" />
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                v-model="formData.ativo"
                :disabled="modalMode === 'view'"
              />
              <label class="form-check-label">Ativo</label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Visível</label>
            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                v-model="formData.visivel"
                :disabled="modalMode === 'view'"
              />
              <label class="form-check-label">Visível</label>
            </div>
          </div>
        </div>
      </form>
    </FormModal>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import FormModal from "@/components/modals/FormModal.vue";
import PaginatedGrid from "@/components/ui/Grid/PaginatedGrid.vue";
import { useNotification } from "@/composables/useNotification";
import type { Column } from "@/types/grid";
import type { SortInfo } from "@/types/api/base/filters";
import { FuncionalidadesService } from "@/modules/subscricao/planos/services/FuncionalidadesService";
import type {
  IFuncionalidade,
  IFuncionalidadeList,
  FuncionalidadeFilter,
} from "@/modules/subscricao/planos/types";



const { showNotification } = useNotification();
const funcionalidadesService = FuncionalidadesService.getInstance();

// Estado do componente
const funcionalidades = ref<IFuncionalidadeList[]>([]);
const loading = ref<boolean>(false);
const showForm = ref<boolean>(false);
const modalMode = ref<'view' | 'edit' | 'add'>('view');
const currentPage = ref<number>(1);
const formData = ref<IFuncionalidade>({} as IFuncionalidade);
const pageSize = ref<number>(10);
const totalItems = ref<number>(0);
const currentSort = ref<SortInfo>({ field: "nome", direction: "asc" }); // Default sort by nome

// Estado separado para loading do modal
const loadingModal = ref(false);

// Computed para título do modal
const getModalTitle = computed(() => {
  switch (modalMode.value) {
    case 'add':
      return 'Nova Funcionalidade';
    case 'edit':
      return 'Editar Funcionalidade';
    default:
      return 'Detalhes da Funcionalidade';
  }
});

// Função para abrir modal de adição
const showAddModal = () => {
  formData.value = {
    nome: '',
    categoria: '',
    descricao: '',
    tipoLimite: '',
    unidadeMedida: '',
    ordem: 0,
    ativo: true,
    visivel: true,
    key: '',
  } as IFuncionalidade;
  modalMode.value = 'add';
  showForm.value = true;
};

// Função para abrir modal de edição
const loadFuncionalidadeAndShowModal = async (item: IFuncionalidade, mode: 'view' | 'edit') => {
  try {
    loadingModal.value = true;
    const response = await funcionalidadesService.buscarPorId(item.id);
    formData.value = { ...response.data };
    modalMode.value = mode;
    showForm.value = true;
  } catch (error) {
    console.error(`Erro ao carregar ${mode === 'view' ? 'detalhes da' : ''} funcionalidade:`, error);
    showNotification({
      type: "error",
      message: `Erro ao carregar ${mode === 'view' ? 'detalhes da' : ''} funcionalidade. Tente novamente mais tarde.`,
    });
  } finally {
    loadingModal.value = false;
  }
};

// Função para visualizar detalhes
const visualizarDetalhe = (item: IFuncionalidade) => loadFuncionalidadeAndShowModal(item, 'view');

// Função para editar
const showEditModal = (item: IFuncionalidade) => loadFuncionalidadeAndShowModal(item, 'edit');

// Função para salvar (create/update)
const handleSave = async () => {
  try {
    loadingModal.value = true;
    await funcionalidadesService.upsert(formData.value);
    showNotification({
      type: "success",
      message: `Funcionalidade ${modalMode.value === 'add' ? 'adicionada' : 'atualizada'} com sucesso!`,
    });
    hideFormHandler();
    await loadFuncionalidades();
  } catch (error) {
    console.error("Erro ao salvar funcionalidade:", error);
    showNotification({
      type: "error",
      message: `Erro ao ${modalMode.value === 'add' ? 'adicionar' : 'atualizar'} funcionalidade. Tente novamente mais tarde.`,
    });
  } finally {
    loadingModal.value = false;
  }
};

// Função para fechar o modal
const hideFormHandler = () => {
  showForm.value = false;
  formData.value = {} as IFuncionalidade;
  modalMode.value = 'view';
};



// Definição das colunas
const columns = ref<Column[]>([
  { field: "nome", label: "Nome", width: "40%", sortable: true },
  { field: "key", label: "Key", width: "35%", sortable: true },
  { field: "ativo", label: "Status", type: "status", width: "25%", sortable: true }
]);

const handleSort = (sort: SortInfo): void => {
  currentSort.value = sort;
  loadFuncionalidades(); // Recarrega ao mudar a ordenação
};

const handlePageChange = (page: number): void => {
  currentPage.value = page;
  loadFuncionalidades(); // Recarrega ao mudar a página
};

const handleItemsPerPage = (value: number): void => {
  pageSize.value = value;
  currentPage.value = 1;
  loadFuncionalidades();
};

const loadFuncionalidades = async (): Promise<void> => {
  try {
    loading.value = true;
    const response = await funcionalidadesService.listarPaginado({
      page: currentPage.value,
      pageSize: pageSize.value,
      sortField: currentSort.value.field || 'nome',
      sortDirection: currentSort.value.direction || 'asc'
    });
    
    // O response já vem com o formato { items: [], totalItems: number }
    funcionalidades.value = response.items;
    totalItems.value = response.totalItems;
  } catch (error) {
    console.error("Erro ao carregar funcionalidades:", error);
    showNotification({
      type: "error",
      message: "Erro ao carregar funcionalidades. Tente novamente mais tarde.",
    });
  } finally {
    loading.value = false;
  }
};

// Set up watchers and mounted hook
onMounted(loadFuncionalidades);
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

.funcionalidade-details {
  display: grid;
  gap: 1rem;
  padding: 0.5rem;
}

.funcionalidade-details strong {
  font-weight: 600;
  color: var(--text-secondary, #666);
  margin-right: 0.5rem;
}
</style>
