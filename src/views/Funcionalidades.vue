<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-puzzle-piece"></i> Funcionalidades</h3>
        <button type="button" class="btn btn-primary" @click="showFormHandler()">
          <i class="fas fa-plus"></i> Nova Funcionalidade
        </button>
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
          @view="(item) => visualizarDetalhe(item.id)"
          @edit="showFormHandler"
          @delete="deleteFuncionalidade"
          @page-change="handlePageChange"
          @sort="handleSort"
          @update:items-per-page="handleItemsPerPage"
        />
      </div>
    </div>

    <Modal
      v-if="showDetails"
      :title="'Detalhes da Funcionalidade'"
      @close="showDetails = false"
    >
      <div v-if="selectedFuncionalidade" class="funcionalidade-details">
        <div class="mb-3"><strong>Nome:</strong> {{ selectedFuncionalidade.nome }}</div>
        <div class="mb-3"><strong>Chave:</strong> {{ selectedFuncionalidade.key }}</div>
        <div class="mb-3">
          <strong>Descrição:</strong> {{ selectedFuncionalidade.descricao }}
        </div>
        <div class="mb-3">
          <strong>Categoria:</strong> {{ selectedFuncionalidade.categoria }}
        </div>
        <div class="mb-3">
          <strong>Tipo de Limite:</strong> {{ selectedFuncionalidade.tipoLimite }}
        </div>
        <div class="mb-3">
          <strong>Unidade de Medida:</strong> {{ selectedFuncionalidade.unidadeMedida }}
        </div>
        <div class="mb-3"><strong>Ordem:</strong> {{ selectedFuncionalidade.ordem }}</div>
        <div class="mb-3">
          <strong>Status:</strong>
          {{ selectedFuncionalidade.ativo ? "Ativo" : "Inativo" }}
        </div>
        <div class="mb-3">
          <strong>Visível:</strong> {{ selectedFuncionalidade.visivel ? "Sim" : "Não" }}
        </div>
      </div>
    </Modal>

    <FormModal
      v-if="showForm"
      :title="isEditing ? 'Editar Funcionalidade' : 'Nova Funcionalidade'"
      @close="hideFormHandler"
      @save="handleSubmit"
    >
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nome</label>
            <input v-model="formData.nome" type="text" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Categoria</label>
            <input
              v-model="formData.categoria"
              type="text"
              class="form-control"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <input v-model="formData.descricao" type="text" class="form-control" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tipo de Limite</label>
            <input v-model="formData.tipoLimite" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Unidade de Medida</label>
            <input v-model="formData.unidadeMedida" type="text" class="form-control" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Ordem</label>
            <input
              v-model.number="formData.ordem"
              type="number"
              class="form-control"
              min="0"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select v-model="formData.ativo" class="form-control form-select">
              <option :value="true">Ativo</option>
              <option :value="false">Inativo</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Visível</label>
            <select v-model="formData.visivel" class="form-control form-select">
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
        </div>
      </form>
    </FormModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import FormModal from "@/components/modals/FormModal.vue";
import Modal from "@/components/common/Modal.vue";
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
const pageSize = ref<number>(10);
const totalItems = ref<number>(0);
const currentSort = ref<SortInfo>({ field: "nome", direction: "asc" }); // Default sort by nome

// Detalhes da funcionalidade selecionada
const selectedFuncionalidade = ref<IFuncionalidade | null>(null);
const showDetails = ref<boolean>(false);

// Função para visualizar detalhes
const visualizarDetalhe = async (id: string) => {
  try {
    loading.value = true;
    const response = await funcionalidadesService.buscarPorId(id);
    selectedFuncionalidade.value = response;
    showDetails.value = true;
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

// Não precisamos mais expor a função no window pois agora usamos eventos Vue

// Definição das colunas
const columns = ref<Column[]>([
  { field: "nome", label: "Nome", width: "40%", sortable: true },
  { field: "key", label: "Key", width: "35%", sortable: true },
  { field: "ativo", label: "Status", type: "status", width: "25%", sortable: true }
]);

// Interfaces
interface IFuncionalidadeForm {
  id: string | null;
  nome: string;
  descricao: string;
  categoria: string;
  tipoLimite: string;
  unidadeMedida: string;
  ordem: number;
  ativo: boolean;
  visivel: boolean;
}
const formData = ref<IFuncionalidadeForm>({
  id: null,
  nome: "",
  descricao: "",
  categoria: "",
  tipoLimite: "",
  unidadeMedida: "",
  ordem: 0,
  ativo: true,
  visivel: true,
});

// Handlers
const showFormHandler = (funcionalidade: IFuncionalidade | null = null): void => {
  showForm.value = true;
  if (funcionalidade) {
    isEditing.value = true;
    formData.value = {
      id: funcionalidade.id,
      nome: funcionalidade.nome,
      descricao: funcionalidade.descricao,
      categoria: funcionalidade.categoria,
      tipoLimite: funcionalidade.tipoLimite,
      unidadeMedida: funcionalidade.unidadeMedida,
      ordem: funcionalidade.ordem,
      ativo: funcionalidade.ativo,
      visivel: funcionalidade.visivel,
    };
  } else {
    isEditing.value = false;
    formData.value = {
      id: null,
      nome: "",
      descricao: "",
      categoria: "",
      tipoLimite: "",
      unidadeMedida: "",
      ordem: 0,
      ativo: true,
      visivel: true,
    };
  }
};

const hideFormHandler = (): void => {
  showForm.value = false;
  isEditing.value = false;
  formData.value = {
    id: null,
    nome: "",
    descricao: "",
    categoria: "",
    tipoLimite: "",
    unidadeMedida: "",
    ordem: 0,
    ativo: true,
    visivel: true,
  };
};

const handleSubmit = async (): Promise<void> => {
  try {
    const { id, ...funcionalidadeData } = formData.value;

    if (isEditing.value && id !== null) {
      await funcionalidadesService.atualizar(id, {
        ...funcionalidadeData,
      });
      showNotification({
        type: "success",
        message: "Funcionalidade atualizada com sucesso!",
      });
    } else {
      await funcionalidadesService.criar({
        ...funcionalidadeData,
      });
      showNotification({
        type: "success",
        message: "Funcionalidade criada com sucesso!",
      });
    }
    await loadFuncionalidades();
    hideFormHandler();
  } catch (error) {
    console.error("Erro ao salvar funcionalidade:", error);
    showNotification({
      type: "error",
      message: "Erro ao salvar funcionalidade. Tente novamente mais tarde.",
    });
  }
};

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
