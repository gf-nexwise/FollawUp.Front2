import api from "./api"

export const planosService = {
  // Planos
  async getPlanos() {
    const response = await api.get("/planos")
    return response.data
  },

  async createPlano(plano) {
    const response = await api.post("/planos", plano)
    return response.data
  },

  async updatePlano(id, plano) {
    const response = await api.put(`/planos/${id}`, plano)
    return response.data
  },

  async deletePlano(id) {
    const response = await api.delete(`/planos/${id}`)
    return response.data
  },

  // Direitos
  async getDireitos(planoId) {
    const response = await api.get(`/planos/${planoId}/direitos`)
    return response.data
  },

  async addDireito(planoId, direito) {
    const response = await api.post(`/planos/${planoId}/direitos`, direito)
    return response.data
  },

  async updateDireito(planoId, direitoId, direito) {
    const response = await api.put(`/planos/${planoId}/direitos/${direitoId}`, direito)
    return response.data
  },

  async deleteDireito(planoId, direitoId) {
    const response = await api.delete(`/planos/${planoId}/direitos/${direitoId}`)
    return response.data
  },

  // Funcionalidades
  async getFuncionalidades(planoId) {
    const response = await api.get(`/planos/${planoId}/funcionalidades`)
    return response.data
  },

  async addFuncionalidade(planoId, funcionalidade) {
    const response = await api.post(`/planos/${planoId}/funcionalidades`, funcionalidade)
    return response.data
  },

  async deleteFuncionalidade(planoId, funcionalidadeId) {
    const response = await api.delete(`/planos/${planoId}/funcionalidades/${funcionalidadeId}`)
    return response.data
  },

  // Preços
  async getPrecos(planoId) {
    const response = await api.get(`/planos/${planoId}/precos`)
    return response.data
  },

  async addPreco(planoId, preco) {
    const response = await api.post(`/planos/${planoId}/precos`, preco)
    return response.data
  },

  async updatePreco(planoId, precoId, preco) {
    const response = await api.put(`/planos/${planoId}/precos/${precoId}`, preco)
    return response.data
  },

  async deletePreco(planoId, precoId) {
    const response = await api.delete(`/planos/${planoId}/precos/${precoId}`)
    return response.data
  },

  // Quotas
  async updateQuota(planoId, funcionalidadeId, quota) {
    const response = await api.put(`/planos/${planoId}/funcionalidades/${funcionalidadeId}/quota`, quota)
    return response.data
  },

  async deleteQuota(planoId, funcionalidadeId) {
    const response = await api.delete(`/planos/${planoId}/funcionalidades/${funcionalidadeId}/quota`)
    return response.data
  },

  // Available items
  async getAvailableDireitos() {
    const response = await api.get("/available-direitos")
    return response.data
  },

  async getAvailableFuncionalidades() {
    const response = await api.get("/available-funcionalidades")
    return response.data
  },
}
