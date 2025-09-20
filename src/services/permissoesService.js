import api from "./api"

export const permissoesService = {
  // Papéis
  async getPapeis() {
    const response = await api.get("/papeis")
    return response.data
  },

  async createPapel(papel) {
    const response = await api.post("/papeis", papel)
    return response.data
  },

  async updatePapel(id, papel) {
    const response = await api.put(`/papeis/${id}`, papel)
    return response.data
  },

  async deletePapel(id) {
    const response = await api.delete(`/papeis/${id}`)
    return response.data
  },

  // Permissões
  async getPermissoes() {
    const response = await api.get("/permissoes")
    return response.data
  },

  async createPermissao(permissao) {
    const response = await api.post("/permissoes", permissao)
    return response.data
  },

  async updatePermissao(id, permissao) {
    const response = await api.put(`/permissoes/${id}`, permissao)
    return response.data
  },

  async deletePermissao(id) {
    const response = await api.delete(`/permissoes/${id}`)
    return response.data
  },

  // Agrupadores
  async getAgrupadores() {
    const response = await api.get("/agrupadores")
    return response.data
  },

  async createAgrupador(agrupador) {
    const response = await api.post("/agrupadores", agrupador)
    return response.data
  },

  async updateAgrupador(id, agrupador) {
    const response = await api.put(`/agrupadores/${id}`, agrupador)
    return response.data
  },

  async deleteAgrupador(id) {
    const response = await api.delete(`/agrupadores/${id}`)
    return response.data
  },

  // Vínculos
  async updatePapelPermissoes(papelId, permissoesIds) {
    const response = await api.put(`/papeis/${papelId}/permissoes`, { permissoesIds })
    return response.data
  },

  async updateFuncionalidadePermissoes(funcionalidadeId, permissoesIds) {
    const response = await api.put(`/funcionalidades/${funcionalidadeId}/permissoes`, { permissoesIds })
    return response.data
  },

  // Funcionalidades (para vínculos)
  async getFuncionalidades() {
    const response = await api.get("/funcionalidades")
    return response.data
  },
}
