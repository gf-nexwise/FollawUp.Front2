<template>
  <div class="grid">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>{{ loadingText }}</span>
    </div>
    
    <table v-else class="table">
      <thead>
        <tr>
          <th 
            v-for="col in effectiveColumns" 
            :key="col.field || col.type"
            :style="{ width: col.width }"
            :class="{ sortable: isSortable(col), active: currentSort?.field === col.field }"
            @click="handleSort(col)"
          >
            <div class="th-content">
              {{ col.label }}
              <span v-if="isSortable(col)" class="sort-icon">
                <i v-if="currentSort?.field !== col.field" class="fas fa-sort"></i>
                <i v-else-if="currentSort.direction === 'asc'" class="fas fa-sort-up"></i>
                <i v-else class="fas fa-sort-down"></i>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td v-for="col in effectiveColumns" :key="col.field || col.type">
            <!-- Status cell -->
            <template v-if="col.type === 'status'">
              <span 
                class="status-badge"
                :class="{ active: item[col.field || 'ativo'] }"
              >
                {{ item[col.field || 'ativo'] ? 'Ativo' : 'Inativo' }}
              </span>
            </template>
            
            <!-- Actions cell -->
            <template v-else-if="col.type === 'actions'">
              <div class="actions">
                <button 
                  v-if="props.actions.includes('view')"
                  class="btn btn-sm btn-outline-secondary" 
                  @click="emit('view', item)"
                  title="Visualizar"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  v-if="props.actions.includes('edit')"
                  class="btn btn-sm btn-outline-primary" 
                  @click="emit('edit', item)"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  v-if="props.actions.includes('delete')"
                  class="btn btn-sm btn-outline-danger" 
                  @click="emit('delete', item)"
                  title="Excluir"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </template>
            
            <!-- Default cell -->
            <template v-else>
              <span v-if="col.formatter" v-html="col.formatter(item)"></span>
              <span v-else>{{ item[col.field || ''] }}</span>
            </template>
          </td>
        </tr>
        <tr v-if="!items.length">
          <td :colspan="columns.length" class="no-data">
            Nenhum registro encontrado
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="!loading && items.length" class="pagination">
      <div class="pagination-info">
        <span class="items-per-page">
          <select v-model="perPageLocal" @change="handlePerPageChange">
            <option value="5">5 por página</option>
            <option value="10">10 por página</option>
            <option value="20">20 por página</option>
            <option value="50">50 por página</option>
          </select>
        </span>
        <span class="total-items">
          Total: {{ totalItems }} registros
        </span>
      </div>

      <div class="pagination-controls">
        <button 
          class="btn btn-sm" 
          :disabled="currentPage === 1"
          @click="emit('page-change', 1)"
          title="Primeira página"
        >
          <i class="fas fa-angle-double-left"></i>
        </button>

        <button 
          class="btn btn-sm" 
          :disabled="currentPage === 1"
          @click="emit('page-change', currentPage - 1)"
          title="Página anterior"
        >
          <i class="fas fa-angle-left"></i>
        </button>
        
        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        
        <button 
          class="btn btn-sm" 
          :disabled="currentPage === totalPages"
          @click="emit('page-change', currentPage + 1)"
          title="Próxima página"
        >
          <i class="fas fa-angle-right"></i>
        </button>

        <button 
          class="btn btn-sm" 
          :disabled="currentPage === totalPages"
          @click="emit('page-change', totalPages)"
          title="Última página"
        >
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import type { Column } from '@/types/grid'

interface SortInfo {
  field: string;
  direction: 'asc' | 'desc';
}

type ActionType = 'view' | 'edit' | 'delete';

const props = withDefaults(defineProps<{
  items: any[];
  columns: Column[];
  loading?: boolean;
  loadingText?: string;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  sort?: SortInfo;
  actions?: ActionType[];
}>(), {
  loading: false,
  loadingText: 'Carregando...',
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
  sort: () => ({ field: '', direction: 'asc' as const }),
  actions: () => []
})

const emit = defineEmits<{
  (e: 'edit', item: any): void;
  (e: 'delete', item: any): void;
  (e: 'view', item: any): void;
  (e: 'page-change', page: number): void;
  (e: 'sort', sort: SortInfo): void;
  (e: 'update:itemsPerPage', value: number): void;
}>()

const perPageLocal = ref(props.itemsPerPage)
const currentSort = computed(() => props.sort || { field: '', direction: 'asc' as const })

// Computed para adicionar a coluna de ações quando necessário
const effectiveColumns = computed(() => {
  if (!props.actions?.length) return props.columns

  // Ajusta as larguras das colunas originais
  const adjustedColumns = props.columns.map(col => {
    const originalWidth = parseInt(col.width as string) || 0
    return {
      ...col,
      width: `${Math.floor(originalWidth * 0.85)}%` // Reduz 15% para a coluna de ações
    }
  })

  // Adiciona a coluna de ações
  return [
    ...adjustedColumns,
    {
      field: 'actions',
      label: 'Ações',
      type: 'actions' as const,
      width: '15%'
    }
  ]
})

const handlePerPageChange = () => {
  emit('update:itemsPerPage', perPageLocal.value)
  if (props.currentPage > 1) {
    emit('page-change', 1)
  }
}

const isSortable = (column: Column): boolean => {
  return column.field != null && column.type !== 'actions' && column.sortable !== false
}

const handleSort = (column: Column) => {
  if (!isSortable(column) || !column.field) return

  const newDirection = !currentSort.value || currentSort.value.field !== column.field
    ? 'asc'
    : currentSort.value.direction === 'asc'
      ? 'desc'
      : 'asc'

  emit('sort', { field: column.field, direction: newDirection })
}
</script>

<style scoped>
.grid {
  width: 100%;
  position: relative;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  text-align: left;
  padding: 0.75rem;
  background-color: var(--gray-50);
  border-bottom: 2px solid var(--gray-200);
}

.table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--gray-100);
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: var(--gray-100);
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-icon {
  color: var(--gray-400);
}

th.active .sort-icon {
  color: var(--primary);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  background-color: var(--gray-100);
  color: var(--gray-600);
}

.status-badge.active {
  background-color: var(--success-light);
  color: var(--success);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.no-data {
  text-align: center;
  color: var(--gray-500);
  padding: 2rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.5rem;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.items-per-page select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--gray-200);
  border-radius: 0.25rem;
  background-color: white;
  font-size: 0.875rem;
}

.total-items {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-info {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin: 0 0.5rem;
}
</style>
