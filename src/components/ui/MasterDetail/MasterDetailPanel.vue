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
  grid-template-columns: 300px 1fr;
  gap: 1rem;
  height: 100%;
}

.master-panel, .detail-panel {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.panel-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-body {
  padding: 1rem;
}

.master-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.master-item {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.master-item:hover {
  background: #f8f9fa;
}

.master-item.active {
  border-color: var(--primary);
  background: var(--primary-light);
}

.master-info h4 {
  margin: 0;
  font-size: 1rem;
}

.master-info p {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: #666;
}

.status-badge {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background: #ffebee;
  color: #c62828;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.detail-title {
  margin: 0;
  font-size: 1.2rem;
}

.items-list {
  margin-top: 1rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.item-info {
  flex: 1;
}

.item-title {
  font-weight: 500;
}

.item-subtitle {
  font-size: 0.9rem;
  color: #666;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-list {
  text-align: center;
  padding: 1rem;
  color: #666;
  font-size: 0.9rem;
}
</style>
