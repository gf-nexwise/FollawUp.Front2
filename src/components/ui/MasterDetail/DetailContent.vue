<template>
  <div>
    <div v-if="loading" class="loading-state">
      <Spinner />
      <p>{{ loadingMessage || 'Carregando...' }}</p>
    </div>
    
    <div v-else-if="!items?.length" class="empty-state">
      <i :class="emptyStateIcon"></i>
      <h3>{{ emptyStateTitle }}</h3>
      <p>{{ emptyStateDescription }}</p>
    </div>

    <div v-else class="items-list">
      <div
        v-for="item in items"
        :key="item.id"
        class="item-row"
      >
        <div class="item-info">
          <div class="item-title">{{ item.nome || item.title }}</div>
          <div v-if="item.key" class="item-subtitle">{{ item.key }}</div>
          <div v-if="item.descricao || item.description" class="item-description">
            {{ item.descricao || item.description }}
          </div>
        </div>
        <div class="item-actions">
          <slot name="item-actions" :item="item" :loading="actionLoading">
            <button
              class="btn btn-danger btn-sm"
              @click="$emit('desvincular', item.id)"
              :disabled="actionLoading"
              :title="removeButtonTitle"
            >
              <i :class="removeButtonIcon"></i>
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DetailContent'
})
</script>

<script setup lang="ts">
import Spinner from '@/components/common/Spinner.vue'

interface DetailItem {
  id: string
  nome?: string
  title?: string
  key?: string
  descricao?: string
  description?: string
  [key: string]: any
}

interface Props {
  loading: boolean
  items: DetailItem[]
  actionLoading?: boolean
  loadingMessage?: string
  emptyStateTitle: string
  emptyStateDescription: string
  emptyStateIcon: string
  removeButtonIcon?: string
  removeButtonTitle?: string
}

withDefaults(defineProps<Props>(), {
  actionLoading: false,
  loadingMessage: 'Carregando...',
  removeButtonIcon: 'fas fa-unlink',
  removeButtonTitle: 'Remover'
})

defineEmits<{
  (e: 'remove', itemId: string): void
  (e: 'desvincular', itemId: string): void
}>()
</script>

<style scoped>
.item-description {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  padding: 2rem;
  color: #666;
}

.loading-state p {
  margin: 0;
  font-size: 0.9rem;
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
  transition: all 0.2s;
}

.item-row:hover {
  background: #f8f9fa;
  border-color: #ddd;
}

.item-info {
  flex: 1;
}

.item-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.item-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
