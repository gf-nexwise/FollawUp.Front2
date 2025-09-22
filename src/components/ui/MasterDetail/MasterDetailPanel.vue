<template>
  <div class="master-detail">
    <div class="master-panel">
      <div class="panel-header">
        <h3 class="panel-title">
          <i :class="masterIcon"></i> {{ masterTitle }}
        </h3>
        <slot name="master-actions"></slot>
      </div>
      <div class="panel-body">
        <div v-if="loading" class="loading-state">
          <Spinner />
          <p>Carregando...</p>
        </div>
        <ul v-else class="master-list">
          <template v-if="items && items.length > 0">
            <li
              v-for="item in items"
              :key="getItemKey(item)"
              :class="['master-item', { active: selectedItem && getItemKey(selectedItem) === getItemKey(item) }]"
              @click="handleSelect(item)"
            >
              <slot name="master-item" :item="item">
                <div class="master-info">
                  <h4>{{ getItemTitle(item) }}</h4>
                  <p v-if="getItemDescription(item)">{{ getItemDescription(item) }}</p>
                </div>
                <span 
                  v-if="showStatus && item.hasOwnProperty('ativo')" 
                  :class="['status-badge', item.ativo ? 'active' : 'inactive']"
                >
                  {{ item.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </slot>
            </li>
          </template>
          <li v-else class="empty-list">
            <p>{{ emptyListText }}</p>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="detail-panel">
      <div class="panel-header">
        <h3 class="panel-title">
          <i :class="detailIcon"></i> {{ detailTitle }}
        </h3>
        <slot name="detail-actions" :selected-item="selectedItem">
          <button
            v-if="selectedItem && showAddButton"
            class="btn btn-primary btn-sm"
            @click="$emit('add')"
          >
            <i class="fas fa-plus"></i> {{ addButtonText }}
          </button>
        </slot>
      </div>
      <div class="panel-body">
        <div v-if="!selectedItem" class="empty-state">
          <i class="fas fa-mouse-pointer"></i>
          <h3>{{ emptyStateTitle }}</h3>
          <p>{{ emptyStateDescription }}</p>
        </div>
        
        <div v-else>
          <div class="detail-header" v-if="showDetailHeader">
            <div>
              <div class="breadcrumb">
                <span>{{ getItemTitle(selectedItem) }}</span>
                <i class="fas fa-chevron-right"></i>
                <span>{{ detailTitle }}</span>
              </div>
              <h2 class="detail-title">{{ detailHeaderTitle }}</h2>
            </div>
          </div>
          
          <slot 
            name="detail-content" 
            :selected-item="selectedItem"
            :loading="detailLoading"
          >
            <div v-if="detailLoading" class="loading-state">
              <Spinner />
              <p>Carregando detalhes...</p>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MasterDetailPanel'
})
</script>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import Spinner from '@/components/common/Spinner.vue'

interface BaseItem {
  id: string | number
  [key: string]: any
}

interface Props {
  items: BaseItem[]
  selectedItem: BaseItem | null
  masterTitle: string
  masterIcon: string
  detailTitle: string
  detailIcon: string
  keyField?: string
  titleField?: string
  descriptionField?: string
  showStatus?: boolean
  showAddButton?: boolean
  addButtonText?: string
  emptyStateTitle?: string
  emptyStateDescription?: string
  emptyListText?: string
  detailHeaderTitle?: string
  showDetailHeader?: boolean
  loading?: boolean
  detailLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  keyField: 'id',
  titleField: 'nome',
  descriptionField: 'descricao',
  showStatus: true,
  showAddButton: false,
  addButtonText: 'Adicionar',
  emptyStateTitle: 'Selecione um item',
  emptyStateDescription: 'Escolha um item à esquerda para ver os detalhes.',
  emptyListText: 'Nenhum item encontrado.',
  detailHeaderTitle: 'Gerenciar',
  showDetailHeader: true,
  loading: false,
  detailLoading: false
})

const emit = defineEmits<{
  (e: 'select', item: BaseItem): void
  (e: 'add'): void
  (e: 'refresh'): void
}>()

const getItemKey = (item: BaseItem): string => {
  return String(item[props.keyField])
}

const getItemTitle = (item: BaseItem): string => {
  return String(item[props.titleField] || '')
}

const getItemDescription = (item: BaseItem): string => {
  return String(item[props.descriptionField] || '')
}

const handleSelect = (item: BaseItem) => {
  emit('select', item)
}
</script>

<style scoped>
.master-detail {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  height: calc(100vh - 200px);
}

.master-panel,
.detail-panel {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.panel-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
}

.master-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.master-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--gray-200);
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid transparent;
}

.master-item:hover {
  background: var(--gray-50);
}

.master-item.active {
  background: var(--primary-light);
  border-left-color: var(--primary);
}

.master-item:last-child {
  border-bottom: none;
}

.master-info h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
}

.master-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--gray-600);
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: #e8f5e8;
  color: var(--success);
}

.status-badge.inactive {
  background: #fff3e0;
  color: var(--warning);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--gray-500);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
}

.empty-state p {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: var(--gray-500);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 1rem;
}

.breadcrumb i {
  font-size: 0.8rem;
  color: var(--gray-400);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.detail-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.items-list {
  margin-top: 1rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--gray-50);
  border-radius: 8px;
  margin-bottom: 8px;
  border-left: 4px solid var(--primary);
}

.item-info {
  flex: 1;
}

.item-title {
  font-weight: 500;
  color: var(--gray-900);
  margin-bottom: 2px;
}

.item-subtitle {
  font-size: 0.85rem;
  color: var(--gray-600);
}

.item-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.item-value {
  background: var(--primary);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.empty-list {
  text-align: center;
  padding: 3rem;
  color: var(--gray-500);
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .master-detail {
    grid-template-columns: 1fr;
    height: auto;
  }
}
</style>
