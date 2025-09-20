<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">{{ plan ? 'Editar Plano' : 'Novo Plano' }}</h2>
        <button class="modal-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">Nome</label>
            <input
              v-model="formData.nome"
              type="text"
              class="form-control"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Descrição</label>
            <input
              v-model="formData.descricao"
              type="text"
              class="form-control"
            >
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Data de Início</label>
              <input
                v-model="formData.dataInicio"
                type="date"
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label class="form-label">Data de Fim</label>
              <input
                v-model="formData.dataFim"
                type="date"
                class="form-control"
              >
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Visibilidade</label>
              <select v-model="formData.isPublico" class="form-control form-select">
                <option :value="true">Público</option>
                <option :value="false">Privado</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tipo de Entidade</label>
              <select v-model="formData.tipoEntidade" class="form-control form-select" required>
                <option value="organizacao">Organização</option>
                <option value="estabelecimento">Estabelecimento</option>
                <option value="usuario">Usuário</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" style="display: flex; align-items: center; gap: 8px;">
              <input v-model="formData.ativo" type="checkbox">
              Plano Ativo
            </label>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Cancelar</button>
        <button class="btn btn-primary" @click="handleSubmit">Salvar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  plan: Object
})

const emit = defineEmits(['save', 'close'])

const formData = ref({
  nome: '',
  descricao: '',
  dataInicio: '',
  dataFim: '',
  isPublico: true,
  tipoEntidade: 'organizacao',
  ativo: true
})

watch(() => props.plan, (newPlan) => {
  if (newPlan) {
    formData.value = { ...newPlan }
  } else {
    formData.value = {
      nome: '',
      descricao: '',
      dataInicio: '',
      dataFim: '',
      isPublico: true,
      tipoEntidade: 'organizacao',
      ativo: true
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('save', { ...formData.value })
}
</script>
