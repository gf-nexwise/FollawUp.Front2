import { ref } from "vue"
import { useNotification } from "./useNotification"

export function usePlanos() {
  const { showNotification } = useNotification()

  const planos = ref([])
  const selectedPlano = ref(null)
  const loading = ref(false)
  const availableDireitos = ref([])
  const availableFuncionalidades = ref([])

  // Mock data for development
  const mockPlanos = ref([
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

  const mockAvailableDireitos = ref([
    { id: 1, nome: "Número de Estabelecimentos" },
    { id: 2, nome: "Usuários por Estabelecimento" },
    { id: 3, nome: "Instâncias de WhatsApp" },
    { id: 4, nome: "Armazenamento (GB)" },
  ])

  const mockAvailableFuncionalidades = ref([
    { id: 1, nome: "Incluir processo" },
    { id: 2, nome: "Alterar processo" },
    { id: 3, nome: "Excluir processo" },
    { id: 4, nome: "Gerar relatórios" },
    { id: 5, nome: "Gerenciar usuários" },
    { id: 6, nome: "Adicionar partes (autores, réus)" },
    { id: 7, nome: "Alterar situação do processo" },
    { id: 8, nome: "Integração API" },
  ])

  const loadPlanos = async () => {
    loading.value = true
    try {
      // Use mock data for development
      planos.value = mockPlanos.value
      availableDireitos.value = mockAvailableDireitos.value
      availableFuncionalidades.value = mockAvailableFuncionalidades.value

      // Uncomment for real API calls
      // const data = await planosService.getPlanos()
      // planos.value = data
    } catch (error) {
      showNotification("Erro ao carregar planos", "error")
    } finally {
      loading.value = false
    }
  }

  const createPlano = async (planoData) => {
    try {
      // Mock implementation
      const newPlano = {
        id: Date.now(),
        ...planoData,
        precos: [],
        direitos: [],
        funcionalidades: [],
      }
      planos.value.push(newPlano)

      // Uncomment for real API calls
      // const newPlano = await planosService.createPlano(planoData)
      // planos.value.push(newPlano)

      showNotification("Plano criado com sucesso!", "success")
      return newPlano
    } catch (error) {
      showNotification("Erro ao criar plano", "error")
      throw error
    }
  }

  const updatePlano = async (id, planoData) => {
    try {
      // Mock implementation
      const index = planos.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        planos.value[index] = { ...planos.value[index], ...planoData }
      }

      // Uncomment for real API calls
      // const updatedPlano = await planosService.updatePlano(id, planoData)
      // const index = planos.value.findIndex(p => p.id === id)
      // if (index !== -1) {
      //   planos.value[index] = updatedPlano
      // }

      showNotification("Plano atualizado com sucesso!", "success")
    } catch (error) {
      showNotification("Erro ao atualizar plano", "error")
      throw error
    }
  }

  const deletePlano = async (id) => {
    try {
      // Mock implementation
      planos.value = planos.value.filter((p) => p.id !== id)

      // Uncomment for real API calls
      // await planosService.deletePlano(id)
      // planos.value = planos.value.filter(p => p.id !== id)

      showNotification("Plano excluído com sucesso!", "success")
    } catch (error) {
      showNotification("Erro ao excluir plano", "error")
      throw error
    }
  }

  const addItemToPlano = async (planoId, type, item) => {
    try {
      const plano = planos.value.find((p) => p.id === planoId)
      if (plano) {
        const arrayName = type.toLowerCase()
        if (!plano[arrayName]) plano[arrayName] = []

        // Check if item already exists
        const exists = plano[arrayName].some((existing) => existing.id === item.id)
        if (exists) {
          showNotification("Este item já foi adicionado", "error")
          return
        }

        plano[arrayName].push(item)
        showNotification("Item adicionado com sucesso!", "success")
      }
    } catch (error) {
      showNotification("Erro ao adicionar item", "error")
      throw error
    }
  }

  const removeItemFromPlano = async (planoId, type, itemId) => {
    try {
      const plano = planos.value.find((p) => p.id === planoId)
      if (plano) {
        const arrayName = type.toLowerCase()
        plano[arrayName] = plano[arrayName].filter((item) => item.id !== itemId)
        showNotification("Item removido com sucesso!", "success")
      }
    } catch (error) {
      showNotification("Erro ao remover item", "error")
      throw error
    }
  }

  const updateQuota = async (planoId, funcionalidadeId, quota) => {
    try {
      const plano = planos.value.find((p) => p.id === planoId)
      if (plano) {
        const funcionalidade = plano.funcionalidades.find((f) => f.id === funcionalidadeId)
        if (funcionalidade) {
          funcionalidade.quota = quota
          showNotification("Quota atualizada com sucesso!", "success")
        }
      }
    } catch (error) {
      showNotification("Erro ao atualizar quota", "error")
      throw error
    }
  }

  const formatTipoEntidade = (tipo) => {
    const tipos = {
      organizacao: "Organização",
      estabelecimento: "Estabelecimento",
      usuario: "Usuário",
    }
    return tipos[tipo] || tipo
  }

  return {
    planos,
    selectedPlano,
    loading,
    availableDireitos,
    availableFuncionalidades,
    loadPlanos,
    createPlano,
    updatePlano,
    deletePlano,
    addItemToPlano,
    removeItemFromPlano,
    updateQuota,
    formatTipoEntidade,
  }
}
