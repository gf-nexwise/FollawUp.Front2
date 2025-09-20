import { BaseHttpService } from './base/BaseHttpService'
import type { 
  IAgrupador, 
  INovoAgrupador, 
  IAtualizarAgrupador, 
  TipoAgrupador 
} from '@/types/agrupadores'
import type { PagedResponse } from '@/types/api/base/responses'
import type { AgrupadorFilter } from '@/types/api/agrupadores/filters'

// Mock data
const mockAgrupadores = {
  FUNCIONALIDADE: [
    {
      id: 1,
      nome: 'Processos',
      descricao: 'Agrupador para funcionalidades relacionadas a gestão de processos',
      tipo: 'FUNCIONALIDADE',
      ativo: true
    },
    {
      id: 2,
      nome: 'Documentos',
      descricao: 'Agrupador para funcionalidades de gestão documental',
      tipo: 'FUNCIONALIDADE',
      ativo: true
    },
    {
      id: 3,
      nome: 'Audiências',
      descricao: 'Agrupador para funcionalidades de controle de audiências',
      tipo: 'FUNCIONALIDADE',
      ativo: true
    }
  ],
  PERMISSAO: [
    {
      id: 4,
      nome: 'Acesso Básico',
      descricao: 'Agrupador para permissões de acesso básico ao sistema',
      tipo: 'PERMISSAO',
      ativo: true
    },
    {
      id: 5,
      nome: 'Gestão de Processos',
      descricao: 'Agrupador para permissões de gestão processual',
      tipo: 'PERMISSAO',
      ativo: true
    }
  ]
} as Record<TipoAgrupador, IAgrupador[]>

class AgrupadoresService extends BaseHttpService<IAgrupador, AgrupadorFilter> {
  constructor() {
    super('/agrupadores')
  }

  /**
   * Lista os agrupadores por tipo de forma paginada
   */
  async listarPaginado(filter: AgrupadorFilter): Promise<PagedResponse<IAgrupador>> {
    try {
      // Comentado chamada real da API para evitar erros 404
      // return await super.getGrid(filter)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      const { page = 1, pageSize = 10, tipo } = filter
      const start = (page - 1) * pageSize
      const end = start + pageSize

      const lista = mockAgrupadores[tipo as keyof typeof mockAgrupadores] || []
      const items = lista.slice(start, end)
      const totalItems = lista.length
      const totalPages = Math.ceil(totalItems / pageSize)

      return {
        items,
        totalItems,
        currentPage: page,
        pageSize,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    } catch (error) {
      console.error('Erro ao listar agrupadores:', error)
      return {
        items: [],
        totalItems: 0,
        currentPage: filter.page ?? 1,
        pageSize: filter.pageSize ?? 10,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
      }
    }
  }

  /**
   * Lista todos os agrupadores por tipo
   */
  async listar(tipo: TipoAgrupador): Promise<IAgrupador[]> {
    try {
      // Comentado chamada real da API para evitar erros 404
      // return await super.getAll()
      
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockAgrupadores[tipo] || []
    } catch (error) {
      console.error('Erro ao listar agrupadores:', error)
      return []
    }
  }

  /**
   * Cria um novo agrupador
   */
  async criar(agrupador: INovoAgrupador): Promise<IAgrupador> {
    try {
      // Comentado chamada real da API para evitar erros 404
      // return await super.create(agrupador)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      const novoAgrupador: IAgrupador = {
        ...agrupador,
        id: Date.now()
      }
      
      mockAgrupadores[agrupador.tipo].push(novoAgrupador)
      return novoAgrupador
    } catch (error) {
      console.error('Erro ao criar agrupador:', error)
      throw new Error('Erro ao criar agrupador')
    }
  }

  /**
   * Atualiza um agrupador existente
   */
  async atualizar(id: number, agrupador: IAtualizarAgrupador): Promise<IAgrupador> {
    try {
      // Comentado chamada real da API para evitar erros 404
      // return await super.update(id, agrupador)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      const lista = mockAgrupadores[agrupador.tipo!]
      const index = lista.findIndex(a => a.id === id)
      
      if (index === -1) {
        throw new Error('Agrupador não encontrado')
      }
      
      const agrupadoresAtualizado = { ...lista[index], ...agrupador }
      lista[index] = agrupadoresAtualizado
      return agrupadoresAtualizado
    } catch (error) {
      console.error('Erro ao atualizar agrupador:', error)
      throw error
    }
  }

  /**
   * Exclui um agrupador
   */
  async excluir(id: number, tipo: TipoAgrupador): Promise<void> {
    try {
      // Comentado chamada real da API para evitar erros 404
      // return await super.delete(id)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      const lista = mockAgrupadores[tipo]
      const index = lista.findIndex(a => a.id === id)
      
      if (index === -1) {
        throw new Error('Agrupador não encontrado')
      }
      
      lista.splice(index, 1)
    } catch (error) {
      console.error('Erro ao excluir agrupador:', error)
      throw error
    }
  }
}

// Exporta uma instância única do serviço
export default new AgrupadoresService()