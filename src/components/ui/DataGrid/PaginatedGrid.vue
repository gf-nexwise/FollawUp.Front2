<template>
  <div>
    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <span>{{ loadingText }}</span>
    </div>
    
    <table v-else class="grid-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.field" :style="column.width ? { width: column.width } : {}">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedItems" :key="item.id">
          <td v-for="column in columns" :key="column.field">
            <!-- Status badge -->
            <template v-if="column.type === 'status'">
              <span :class="['status-badge', item[column.statusField || 'ativo'] ? 'active' : 'inactive']">
                {{ item[column.statusField || 'ativo'] ? 'Ativo' : 'Inativo' }}
              </span>
            </template>
            
            <!-- Actions buttons -->
            <template v-else-if="column.type === 'actions'">
              <div class="action-buttons">
                <button v-if="!hideEdit" class="edit-btn" title="Editar" @click="$emit('edit', item)">
                  <i class="fas fa-edit"></i>
                </button>
                <button v-if="!hideDelete" class="delete-btn" title="Excluir" @click="$emit('delete', item)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </template>
            
            <!-- Default content -->
            <template v-else>
              {{ item[column.field] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginação -->
    <div v-if="!loading && totalItems > 0" class="pagination-container">
      <div class="pagination-info">
        <div class="items-per-page">
          <span>Itens por página:</span>
          <select 
            v-model="localPageSize" 
            class="page-size-select"
            @change="handlePageSizeChange"
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
          @click="goToPage(1)"
          title="Primeira página"
        >
          <i class="fas fa-angle-double-left"></i>
        </button>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1" 
          @click="goToPage(currentPage - 1)"
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
          @click="goToPage(currentPage + 1)"
          title="Próxima página"
        >
          <i class="fas fa-angle-right"></i>
        </button>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages" 
          @click="goToPage(totalPages)"
          title="Última página"
        >
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true,
    // [{ field: 'nome', label: 'Nome' }, { field: 'descricao', label: 'Descrição' }]
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Carregando dados...'
  },
  hideEdit: {
    type: Boolean,
    default: false
  },
  hideDelete: {
    type: Boolean,
    default: false
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['edit', 'delete', 'page-change', 'page-size-change'])

// Paginação
const currentPage = ref(1)
const localPageSize = ref(props.pageSize)
const pageSizeOptions = [10, 25, 50, 100]

// Reset page when items change
watch(() => props.items, () => {
  currentPage.value = 1
})

// Computed properties for pagination
const totalItems = computed(() => props.items.length)
const totalPages = computed(() => Math.ceil(totalItems.value / localPageSize.value))
const startItem = computed(() => ((currentPage.value - 1) * localPageSize.value) + 1)
const endItem = computed(() => Math.min(currentPage.value * localPageSize.value, totalItems.value))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * localPageSize.value
  const end = start + localPageSize.value
  return props.items.slice(start, end)
})

// Methods
const handlePageSizeChange = () => {
  currentPage.value = 1
  emit('page-size-change', localPageSize.value)
}

const goToPage = (page) => {
  currentPage.value = page
  emit('page-change', page)
}
</script>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-secondary);
  gap: 1rem;
}

.loading-state i {
  font-size: 1.5rem;
  color: var(--primary);
}
</style>