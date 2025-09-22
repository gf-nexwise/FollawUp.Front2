<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-puzzle-piece"></i> Funcionalidades</h3>
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
      :title="'Detalhes da Funcionalidade'"
      @close="hideFormHandler"
    >
      <form>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nome</label>
            <input v-model="formData.nome" type="text" class="form-control" disabled />
          </div>
          <div class="form-group">
            <label class="form-label">Categoria</label>
            <input v-model="formData.categoria" type="text" class="form-control" disabled />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <input v-model="formData.descricao" type="text" class="form-control" disabled />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tipo de Limite</label>
            <input v-model="formData.tipoLimite" type="text" class="form-control" disabled />
          </div>
          <div class="form-group">
            <label class="form-label">Unidade de Medida</label>
            <input v-model="formData.unidadeMedida" type="text" class="form-control" disabled />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Ordem</label>
            <input v-model.number="formData.ordem" type="number" class="form-control" disabled />
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <input :value="formData.ativo ? 'Ativo' : 'Inativo'" type="text" class="form-control" disabled />
          </div>
          <div class="form-group">
            <label class="form-label">Visível</label>
            <input :value="formData.visivel ? 'Sim' : 'Não'" type="text" class="form-control" disabled />
          </div>
        </div>
      </form>
    </FormModal>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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
const isEditing = ref<boolean>(false);
const currentPage = ref<number>(1);
const formData = ref<IFuncionalidade>({} as IFuncionalidade);
const pageSize = ref<number>(10);
const totalItems = ref<number>(0);
const currentSort = ref<SortInfo>({ field: "nome", direction: "asc" }); // Default sort by nome

// Detalhes da funcionalidade selecionada
const selectedFuncionalidade = ref<IFuncionalidade | null>(null);
const showDetails = ref<boolean>(false);

// Função para visualizar detalhes
const hideFormHandler = () => {
  showForm.value = false;
  formData.value = {} as IFuncionalidade;
  isEditing.value = false;
};

const visualizarDetalhe = async (item: IFuncionalidade) => {
  try {
    loading.value = true;
    const response = await funcionalidadesService.buscarPorId(item.id);
    formData.value = { ...response.data };
    isEditing.value = false;
    showForm.value = true;
  } catch (error) {
    console.error("Erro ao carregar detalhes da funcionalidade:", error);
    showNotification({
      type: "error",
      message: "Erro ao carregar detalhes da funcionalidade. Tente novamente mais tarde.",
    });
  } finally {
    loading.value = false;
  }
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

const deleteFuncionalidade = async (item: IFuncionalidade): Promise<void> => {
  if (confirm("Tem certeza que deseja excluir esta funcionalidade?")) {
    try {
      await funcionalidadesService.excluir(item.id);
      showNotification({
        type: "success",
        message: "Funcionalidade excluída com sucesso!",
      });
      await loadFuncionalidades();
    } catch (error) {
      console.error("Erro ao excluir funcionalidade:", error);
      showNotification({
        type: "error",
        message: "Erro ao excluir funcionalidade. Tente novamente mais tarde.",
      });
    }
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
