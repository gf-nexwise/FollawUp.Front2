<template>
  <div>
    <div v-if="loading" class="empty-state">
      <i class="fas fa-spinner fa-spin"></i>
      <h3>Carregando...</h3>
    </div>

    <div v-else-if="planos.length === 0" class="empty-state">
      <i class="fas fa-layer-group"></i>
      <h3>Nenhum plano cadastrado</h3>
      <p>Crie seu primeiro plano para começar.</p>
      <button class="btn btn-primary" @click="showPlanModal()">
        <i class="fas fa-plus"></i> Novo Plano
      </button>
    </div>

    <div v-else>
      <div class="detail-header">
        <div>
          <h2 class="detail-title">Planos Cadastrados</h2>
        </div>
        <button class="btn btn-primary" @click="showPlanModal()">
          <i class="fas fa-plus"></i> Novo Plano
        </button>
      </div>

      <div class="plans-grid">
        <div v-for="plan in planos" :key="plan.id" class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-layer-group"></i> {{ plan.nome }}
            </h3>
            <div class="card-header-badges">
              <span :class="['status-badge', plan.isPublico ? 'public' : 'private']">
                {{ plan.isPublico ? 'Público' : 'Privado' }}
              </span>
              <span :class="['status-badge', plan.ativo ? 'active' : 'inactive']">
                {{ plan.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
          </div>
          <div class="card-body">
            <p style="margin-bottom: 1rem;">{{ plan.descricao }}</p>
            <p style="margin-bottom: 0.5rem;">
              <strong>Vigência:</strong> {{ plan.dataInicio || 'N/D' }} até {{ plan.dataFim || 'Indeterminado' }}
            </p>
            <p style="margin-bottom: 0;">
              <strong>Tipo:</strong> {{ formatTipoEntidade(plan.tipoEntidade) }}
            </p>
          </div>
          <div class="card-footer">
            <button class="btn btn-secondary btn-sm" @click="showPlanModal(plan)">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-danger btn-sm" @click="deletePlan(plan.id)">
              <i class="fas fa-trash"></i> Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <PlanModal
      v-if="showModal"
      :plan="selectedPlan"
      @save="handleSavePlan"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PlanModal from '@/components/modals/PlanModal.vue'

const planos = ref([
  {
    id: 1,
    nome: "Plano Básico",
    descricao: "Ideal para equipes pequenas.",
    tipoEntidade: "organizacao",
    ativo: true,
    dataInicio: "2024-01-01",
    dataFim: null,
    isPublico: true,
    precos: [
      { id: 1, recorrencia: "Mensal", valor: 39.9 },
      { id: 2, recorrencia: "Anual", valor: 399.0 },
    ],
    direitos: [{ id: 1, nome: "Número de Estabelecimentos", limite: 1 }],
    funcionalidades: [
      { id: 1, nome: "Incluir processo", quota: null },
      { id: 2, nome: "Alterar processo", quota: null },
      { id: 8, nome: "Integração API", quota: { tipo: "Mensal", limite: 1000 } },
    ],
  },
  {
    id: 2,
    nome: "Plano Profissional",
    descricao: "Para empresas em crescimento.",
    tipoEntidade: "estabelecimento",
    ativo: true,
    dataInicio: "2024-01-01",
    dataFim: null,
    isPublico: true,
    precos: [
      { id: 3, recorrencia: "Mensal", valor: 99.9 },
      { id: 4, recorrencia: "Anual", valor: 999.0 },
    ],
    direitos: [
      { id: 1, nome: "Número de Estabelecimentos", limite: 5 },
      { id: 2, nome: "Usuários por Estabelecimento", limite: 20 },
    ],
    funcionalidades: [
      { id: 1, nome: "Incluir processo", quota: null },
      { id: 4, nome: "Gerar relatórios", quota: { tipo: "Mensal", limite: 50 } },
    ],
  },
])

const loading = ref(false)
const showModal = ref(false)
const selectedPlan = ref(null)

const formatTipoEntidade = (tipo) => {
  const tipos = {
    organizacao: "Organização",
    estabelecimento: "Estabelecimento",
    usuario: "Usuário",
  }
  return tipos[tipo] || tipo
}

const showPlanModal = (plan = null) => {
  selectedPlan.value = plan
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPlan.value = null
}

const handleSavePlan = (planData) => {
  if (selectedPlan.value) {
    const index = planos.value.findIndex(p => p.id === selectedPlan.value.id)
    if (index !== -1) {
      planos.value[index] = { ...planos.value[index], ...planData }
    }
  } else {
    const newPlano = {
      id: Date.now(),
      ...planData,
      precos: [],
      direitos: [],
      funcionalidades: [],
    }
    planos.value.push(newPlano)
  }
  closeModal()
}

const deletePlan = (planId) => {
  if (confirm('Tem certeza que deseja excluir este plano?')) {
    planos.value = planos.value.filter(p => p.id !== planId)
  }
}

onMounted(() => {
  loading.value = false
})
</script>
