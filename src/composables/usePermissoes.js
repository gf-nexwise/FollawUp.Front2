import { ref } from "vue"
import { useNotification } from "./useNotification"

export function usePermissoes() {
  const { showNotification } = useNotification()

  const papeis = ref([])
  const permissoes = ref([])
  const agrupadores = ref([])
  const funcionalidades = ref([])
  const loading = ref(false)

  // Mock data for development
  const mockData = ref({
    papeis: [
      {
        id: 1,
        nome: "Advogado(a) Gestor(a)",
        descricao: "Supervisiona uma equipe...",
        ativo: true,
        permissoesIds: [2, 4, 6, 8],
      },
      {
        id: 2,
        nome: "Advogado(a) Parceiro(a)",
        descricao: "Atua em casos específicos.",
        ativo: true,
        permissoesIds: [2, 4],
      },
    ],
    permissoes: [
      { id: 1, nome: "Adicionar Assunto", key: "processos:adicionar-assunto", descricao: "...", ativo: true },
      { id: 2, nome: "Listar Processos", key: "processos:listar", descricao: "...", ativo: true },
      { id: 4, nome: "Criar Caso", key: "casos:criar", descricao: "...", ativo: true },
      { id: 6, nome: "Desvincular Processo", key: "casos:desvincular-processo", descricao: "...", ativo: true },
      { id: 8, nome: "Criar Acesso", key: "acesso:criar", descricao: "...", ativo: true },
      { id: 9, nome: "Obter Acesso", key: "acesso:obter", descricao: "...", ativo: true },
    ],
    funcionalidades: [
      { id: 1, nome: "Incluir processo", permissoesIds: [4, 2] },
      { id: 2, nome: "Alterar processo", permissoesIds: [] },
      { id: 3, nome: "Alterar responsável do processo", permissoesIds: [] },
      { id: 4, nome: "Alterar situação do processo", permissoesIds: [] },
      { id: 5, nome: "Adicionar partes (autores, réus)", permissoesIds: [] },
      { id: 6, nome: "Excluir processo", permissoesIds: [] },
      { id: 7, nome: "Gerar relatórios", permissoesIds: [] },
      { id: 8, nome: "Integração API", permissoesIds: [] },
    ],
    agrupadores: [
      { id: 1, nome: "Gestão de Processos", ativo: true, funcionalidadesIds: [1, 2, 3, 5] },
      { id: 2, nome: "Gestão de Casos", ativo: false, funcionalidadesIds: [] },
    ],
  })

  const loadData = async () => {
    loading.value = true
    try {
      // Use mock data for development
      papeis.value = mockData.value.papeis
      permissoes.value = mockData.value.permissoes
      agrupadores.value = mockData.value.agrupadores
      funcionalidades.value = mockData.value.funcionalidades

      // Uncomment for real API calls
      // const [papeisData, permissoesData, agrupadoresData, funcionalidadesData] = await Promise.all([
      //   permissoesService.getPapeis(),
      //   permissoesService.getPermissoes(),
      //   permissoesService.getAgrupadores(),
      //   permissoesService.getFuncionalidades()
      // ])
      // papeis.value = papeisData
      // permissoes.value = permissoesData
      // agrupadores.value = agrupadoresData
      // funcionalidades.value = funcionalidadesData
    } catch (error) {
      showNotification("Erro ao carregar dados", "error")
    } finally {
      loading.value = false
    }
  }

  const createItem = async (type, itemData) => {
    try {
      // Mock implementation
      const newItem = {
        id: Date.now(),
        ...itemData,
        ...(type === "papeis" && { permissoesIds: [] }),
        ...(type === "agrupadores" && { funcionalidadesIds: [] }),
        ...(type === "funcionalidades" && { permissoesIds: [] }),
      }

      if (type === "papeis") papeis.value.push(newItem)
      else if (type === "permissoes") permissoes.value.push(newItem)
      else if (type === "agrupadores") agrupadores.value.push(newItem)

      // Uncomment for real API calls
      // const service = type === 'papeis' ? 'createPapel' :
      //                type === 'permissoes' ? 'createPermissao' : 'createAgrupador'
      // const newItem = await permissoesService[service](itemData)
      // eval(`${type}.value.push(newItem)`)

      showNotification(`${capitalize(type.slice(0, -1))} criado com sucesso!`, "success")
      return newItem
    } catch (error) {
      showNotification(`Erro ao criar ${type.slice(0, -1)}`, "error")
      throw error
    }
  }

  const updateItem = async (type, id, itemData) => {
    try {
      // Mock implementation
      const array = type === "papeis" ? papeis.value : type === "permissoes" ? permissoes.value : agrupadores.value
      const index = array.findIndex((item) => item.id === id)
      if (index !== -1) {
        array[index] = { ...array[index], ...itemData }
      }

      showNotification(`${capitalize(type.slice(0, -1))} atualizado com sucesso!`, "success")
    } catch (error) {
      showNotification(`Erro ao atualizar ${type.slice(0, -1)}`, "error")
      throw error
    }
  }

  const deleteItem = async (type, id) => {
    try {
      // Mock implementation
      if (type === "papeis") papeis.value = papeis.value.filter((item) => item.id !== id)
      else if (type === "permissoes") permissoes.value = permissoes.value.filter((item) => item.id !== id)
      else if (type === "agrupadores") agrupadores.value = agrupadores.value.filter((item) => item.id !== id)

      showNotification(`${capitalize(type.slice(0, -1))} excluído com sucesso!`, "success")
    } catch (error) {
      showNotification(`Erro ao excluir ${type.slice(0, -1)}`, "error")
      throw error
    }
  }

  const updatePapelPermissoes = async (papelId, permissoesIds) => {
    try {
      const papel = papeis.value.find((p) => p.id === papelId)
      if (papel) {
        papel.permissoesIds = permissoesIds
        showNotification("Permissões do papel atualizadas com sucesso!", "success")
      }
    } catch (error) {
      showNotification("Erro ao atualizar permissões do papel", "error")
      throw error
    }
  }

  const updateFuncionalidadePermissoes = async (funcionalidadeId, permissoesIds) => {
    try {
      const funcionalidade = funcionalidades.value.find((f) => f.id === funcionalidadeId)
      if (funcionalidade) {
        funcionalidade.permissoesIds = permissoesIds
        showNotification("Permissões da funcionalidade atualizadas com sucesso!", "success")
      }
    } catch (error) {
      showNotification("Erro ao atualizar permissões da funcionalidade", "error")
      throw error
    }
  }

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return {
    papeis,
    permissoes,
    agrupadores,
    funcionalidades,
    loading,
    loadData,
    createItem,
    updateItem,
    deleteItem,
    updatePapelPermissoes,
    updateFuncionalidadePermissoes,
  }
}
