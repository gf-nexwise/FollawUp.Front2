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
        <table class="grid-table">
          <thead>
            <tr>
              <th style="width: 30%">Nome</th>
              <th style="width: 30%">Key</th>
              <th style="width: 20%">Status</th>
              <th style="width: 20%">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="permissao in paginatedPermissoes" :key="permissao.id">
              <td>{{ permissao.nome }}</td>
              <td>{{ permissao.key }}</td>
              <td>
                <span :class="['status-badge', permissao.ativo ? 'active' : 'inactive']">
                  {{ permissao.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="action-buttons">
                <button class="edit-btn" title="Editar" @click="showFormHandler(permissao)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" title="Excluir" @click="deletePermissao(permissao.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginação -->
        <div class="pagination-container">
          <div class="pagination-info">
            <div class="items-per-page">
              <span>Itens por página:</span>
              <select 
                v-model="pageSize" 
                class="page-size-select"
                @change="handlePageSizeChange($event.target.value)"
              >
                <option v-for="size in pageSizeOptions" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
            </div>
            <span class="items-count">
              Mostrando {{ startItem }} - {{ endItem }} de {{ totalItems }} itens
            </span>
          </div>
          
          <div class="pagination-controls">
            <button 
              class="pagination-btn" 
              :disabled="currentPage === 1" 
              @click="currentPage = 1"
              title="Primeira página"
            >
              <i class="fas fa-angle-double-left"></i>
            </button>
            <button 
              class="pagination-btn" 
              :disabled="currentPage === 1" 
              @click="currentPage--"
              title="Página anterior"
            >
              <i class="fas fa-angle-left"></i>
            </button>
            
            <div class="pagination-pages">
              <span>Página {{ currentPage }} de {{ totalPages }}</span>
            </div>
            
            <button 
              class="pagination-btn" 
              :disabled="currentPage === totalPages" 
              @click="currentPage++"
              title="Próxima página"
            >
              <i class="fas fa-angle-right"></i>
            </button>
            <button 
              class="pagination-btn" 
              :disabled="currentPage === totalPages" 
              @click="currentPage = totalPages"
              title="Última página"
            >
              <i class="fas fa-angle-double-right"></i>
            </button>
          </div>
        </div>
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

<script setup>
import { ref, computed } from 'vue'
import FormModal from '@/components/modals/FormModal.vue'

// Paginação
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [10, 25, 50, 100]

const totalItems = computed(() => permissoes.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))
const startItem = computed(() => ((currentPage.value - 1) * pageSize.value) + 1)
const endItem = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value))

const handlePageSizeChange = (newSize) => {
  pageSize.value = Number(newSize)
  currentPage.value = 1 // Reset to first page when changing page size
}

const paginatedPermissoes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return permissoes.value.slice(start, end)
})

// Dados da tabela
const columns = [
  { field: 'nome', label: 'Nome' },
  { field: 'key', label: 'Key' },
  { field: 'ativo', label: 'Status', type: 'status' },
  { type: 'actions', label: 'Ações' }
]

const permissoes = ref([
  { id: 1, nome: 'Adicionar Assunto', key: 'processos:adicionar-assunto', descricao: '...', ativo: true },
  { id: 2, nome: 'Listar Processos', key: 'processos:listar', descricao: '...', ativo: true },
  { id: 4, nome: 'Criar Caso', key: 'casos:criar', descricao: '...', ativo: true },
  { id: 6, nome: 'Desvincular Processo', key: 'casos:desvincular-processo', descricao: '...', ativo: true },
  { id: 8, nome: 'Criar Acesso', key: 'acesso:criar', descricao: '...', ativo: true },
  { id: 9, nome: 'Obter Acesso', key: 'acesso:obter', descricao: '...', ativo: true }
])

const showForm = ref(false)
const isEditing = ref(false)
const formData = ref({
  id: null,
  nome: '',
  key: '',
  descricao: '',
  ativo: true
})

const showFormHandler = (permissao = null) => {
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

const hideFormHandler = () => {
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

const handleSubmit = () => {
  if (isEditing.value) {
    const index = permissoes.value.findIndex(p => p.id === formData.value.id)
    if (index !== -1) {
      permissoes.value[index] = { ...formData.value }
    }
  } else {
    const newPermissao = {
      ...formData.value,
      id: Date.now()
    }
    permissoes.value.push(newPermissao)
  }
  hideFormHandler()
}

const deletePermissao = (id) => {
  if (confirm('Tem certeza que deseja excluir esta permissão?')) {
    permissoes.value = permissoes.value.filter(p => p.id !== id)
  }
}
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
</style>