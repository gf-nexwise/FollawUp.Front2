<template>
  <teleport to="body">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">Cancelar</button>
          <slot name="footer">
            <button class="btn btn-primary" @click="$emit('save')">Salvar</button>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})

defineEmits(['save', 'close'])
</script>