<template>
  <teleport to="body">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body" :class="{ 'is-loading': loading }">
          <slot></slot>
          <div v-if="loading" class="modal-loading">
            <span class="spinner"></span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">
            {{ mode === 'view' ? 'Fechar' : 'Cancelar' }}
          </button>
          <slot name="footer">
            <button 
              v-if="mode !== 'view'"
              class="btn btn-primary" 
              @click="$emit('save')"
              :disabled="loading"
            >
              {{ mode === 'edit' ? 'Atualizar' : 'Adicionar' }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'FormModal',
  props: {
    title: {
      type: String,
      required: true
    },
    mode: {
      type: String as PropType<'view' | 'edit' | 'add'>,
      required: true,
      validator: (value: string) => ['view', 'edit', 'add'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save', 'close']
});
</script>

<style scoped>
.modal-body {
  position: relative;
  min-height: 100px;
}

.modal-body.is-loading {
  opacity: 0.7;
  pointer-events: none;
}

.modal-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>