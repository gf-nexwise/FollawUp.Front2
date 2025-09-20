<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-chart-pie"></i> Definir Quotas de Uso por Funcionalidade
        </h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleQuotaSubmit">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">1. Selecione o Plano</label>
              <select v-model="selectedPlanId" class="form-control form-select" required @change="onPlanChange">
                <option value="">-- Escolha um Plano --</option>
                <option v-for="plan in planos" :key="plan.id" :value="plan.id">
                  {{ plan.nome }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">2. Selecione a Funcionalidade</label>
              <select v-model="selectedFuncionalidadeId" class="form-control form-select" required :disabled="!selectedPlanId">
                <option value="">-- Primeiro escolha um plano --</option>
                <option v-for="func in availableFuncionalidades" :key="func.id" :value="func.id">
                  {{ func.nome }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">3. Tipo de Limite</label>
              <select v-model="quotaData.tipo" class="form-control form-select" required>
                <option value="Mensal">Mensal</option>
                <option value="Total">Total</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">4. Limite (0 para ilimitado)</label>
              <input v-model.number="quotaData.limite" type="number" class="form-control" min="0" required>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> Salvar Quota
          </button>
        </form>
        
        <div v-if="selectedPlan" style="margin-top: 2rem; border-top: 1px solid var(--gray-200); padding-top: 1.5rem;">
          <h4 style="margin-bottom: 1rem;">Quotas Atuais do Plano "{{ selectedPlan.nome }}"</h4>
          <div v-if="quotasWithFunc.length === 0" class="empty-state">
            <p>Nenhuma quota definida para este plano.</p>
          </div>
          <div v-else>
            <div v-for="func in quotasWithFunc" :key="func.id" class="item-row">
              <div class="item-info">
                <div class="item-title">{{ func.nome }}</div>
                <div class="item-subtitle">Limite: {{ func.quota.tipo }}</div>
              </div>
              <div class="item-actions">
                <span class="item-value">{{ func.quota.limite === 0 ? 'Ilimitado' : func.quota.limite }}</span>
                <button class="btn btn-danger btn-sm" @click="deleteQuota(func.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quotas',
  data() {
    return {
      planos: [
        {
          id: 1,
          nome: "Plano Básico",
          funcionalidades: [
            { id: 1, nome: "Incluir processo", quota: null },
            { id: 2, nome: "Alterar processo", quota: null },
            { id: 8, nome: "Integração API", quota: { tipo: "Mensal", limite: 1000 } },
          ],
        },
        {
          id: 2,
          nome: "Plano Profissional",
          funcionalidades: [
            { id: 1, nome: "Incluir processo", quota: null },
            { id: 4, nome: "Gerar relatórios", quota: { tipo: "Mensal", limite: 50 } },
          ],
        },
      ],
      selectedPlanId: '',
      selectedFuncionalidadeId: '',
      quotaData: {
        tipo: 'Mensal',
        limite: 100
      }
    }
  },
  computed: {
    selectedPlan() {
      return this.planos.find(p => p.id == this.selectedPlanId) || null
    },
    availableFuncionalidades() {
      return this.selectedPlan ? this.selectedPlan.funcionalidades : []
    },
    quotasWithFunc() {
      return this.selectedPlan ? this.selectedPlan.funcionalidades.filter(f => f.quota) : []
    }
  },
  methods: {
    onPlanChange() {
      this.selectedFuncionalidadeId = ''
    },
    handleQuotaSubmit() {
      if (!this.selectedPlanId || !this.selectedFuncionalidadeId) {
        alert('Selecione o plano e a funcionalidade.')
        return
      }

      const funcionalidade = this.selectedPlan.funcionalidades.find(f => f.id == this.selectedFuncionalidadeId)
      if (funcionalidade) {
        funcionalidade.quota = { ...this.quotaData }
        alert('Quota salva com sucesso!')
      }
    },
    deleteQuota(funcionalidadeId) {
      if (confirm('Remover esta quota?')) {
        const funcionalidade = this.selectedPlan.funcionalidades.find(f => f.id === funcionalidadeId)
        if (funcionalidade) {
          funcionalidade.quota = null
        }
      }
    }
  }
}
</script>
