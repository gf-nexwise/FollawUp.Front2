import { BaseHttpService } from '@/services/base/BaseHttpService'
import { TipoAgrupador } from '../types'
import type { IAgrupador, INovoAgrupador, IAtualizarAgrupador } from '../types'
import type { AgrupadorFilter } from '@/types/api/agrupadores/filters'
import type { PagedResponse } from '@/types/api/base/responses'

// Mock data
const mockAgrupadores: Record<TipoAgrupador, IAgrupador[]> = {
  [TipoAgrupador.FUNCIONALIDADE]: [
    {
      id: 1,
      nome: 'Processos',
      descricao: 'Agrupador para funcionalidades relacionadas a gestão de processos',
      tipo: TipoAgrupador.FUNCIONALIDADE,
      ativo: true
    },
    {
      id: 2,
      nome: 'Documentos',
      descricao: 'Agrupador para funcionalidades de gestão documental',
      tipo: TipoAgrupador.FUNCIONALIDADE,
      ativo: true
    },
    {
      id: 3,
      nome: 'Audiências',
      descricao: 'Agrupador para funcionalidades de controle de audiências',
      tipo: TipoAgrupador.FUNCIONALIDADE,
      ativo: true
    },
    {
      id: 6,
      nome: 'Relatórios',
      descricao: 'Agrupador para funcionalidades de relatórios e dashboards',
      tipo: TipoAgrupador.FUNCIONALIDADE,
      ativo: true
    },
    {
      id: 7,
      nome: 'Configurações',
      descricao: 'Agrupador para funcionalidades de configuração do sistema',
      tipo: TipoAgrupador.FUNCIONALIDADE,
      ativo: false
    },
    {
      id: 10,
      nome: 'Financeiro',
      descricao: 'Agrupador para funcionalidades financeiras',
      tipo: TipoAgrupador.FUNCIONALIDADE,
      ativo: true
    },
    {
      id: 11,
      nome: 'Agenda',
      descricao: 'Agrupador para funcionalidades de agenda e calendário',
      tipo: TipoAgrupador.FUNCIONALIDADE,
      ativo: true
    },
    {
      id: 12,
      nome: 'Comunicação',
      descricao: 'Agrupador para funcionalidades de comunicação',
      tipo: TipoAgrupador.FUNCIONALIDADE,
      ativo: false
    },
    {
      id: 13,
      nome: 'Integrações',
      descricao: 'Agrupador para funcionalidades de integração com outros sistemas',
      tipo: TipoAgrupador.FUNCIONALIDADE,
      ativo: true
    },
    {
      id: 14,
      nome: 'Automação',
      descricao: 'Agrupador para funcionalidades de automação de processos',
      tipo: TipoAgrupador.FUNCIONALIDADE,
      ativo: true
    },
    {
      id: 15,
      nome: 'Analytics',
      descricao: 'Agrupador para funcionalidades de análise de dados',
      tipo: TipoAgrupador.FUNCIONALIDADE,
      ativo: true
    }
  ],
  [TipoAgrupador.PERMISSAO]: [
    {
      id: 4,
      nome: 'Acesso Básico',
      descricao: 'Agrupador para permissões de acesso básico ao sistema',
      tipo: TipoAgrupador.PERMISSAO,
      ativo: true
    },
    {
      id: 5,
      nome: 'Gestão de Processos',
      descricao: 'Agrupador para permissões de gestão processual',
      tipo: TipoAgrupador.PERMISSAO,
      ativo: true
    },
    {
      id: 8,
      nome: 'Administração',
      descricao: 'Agrupador para permissões administrativas',
      tipo: TipoAgrupador.PERMISSAO,
      ativo: true
    },
    {
      id: 9,
      nome: 'Relatórios',
      descricao: 'Agrupador para permissões de relatórios',
      tipo: TipoAgrupador.PERMISSAO,
      ativo: false
    },
    {
      id: 16,
      nome: 'Gestão Financeira',
      descricao: 'Agrupador para permissões financeiras',
      tipo: TipoAgrupador.PERMISSAO,
      ativo: true
    },
    {
      id: 17,
      nome: 'Gestão de Usuários',
      descricao: 'Agrupador para permissões de gestão de usuários',
      tipo: TipoAgrupador.PERMISSAO,
      ativo: true
    },
    {
      id: 18,
      nome: 'Auditoria',
      descricao: 'Agrupador para permissões de auditoria',
      tipo: TipoAgrupador.PERMISSAO,
      ativo: true
    },
    {
      id: 19,
      nome: 'Configurações Avançadas',
      descricao: 'Agrupador para permissões de configurações avançadas',
      tipo: TipoAgrupador.PERMISSAO,
      ativo: false
    },
    {
      id: 20,
      nome: 'API e Integrações',
      descricao: 'Agrupador para permissões de API e integrações',
      tipo: TipoAgrupador.PERMISSAO,
      ativo: true
    }
  ]
}

class AgrupadoresService extends BaseHttpService<IAgrupador, AgrupadorFilter> {
  constructor() {
    super('/agrupadores')
  }

  /**
   * Lista os agrupadores por tipo de forma paginada
   */
  async listarPaginado(filter: AgrupadorFilter): Promise<PagedResponse<IAgrupador>> {
    try {
      console.log('Filtro recebido:', filter)
      console.log('Mock data disponível:', mockAgrupadores)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      const { page = 1, pageSize = 10, sort, tipo } = filter
      
      // Filtra os agrupadores pelo tipo
      let lista = mockAgrupadores[tipo as TipoAgrupador] || []
      console.log('Lista filtrada por tipo:', lista)
      
      // Aplica ordenação se houver
      if (sort) {
        const [field, direction] = sort.startsWith('-') 
          ? [sort.substring(1), 'desc'] 
          : [sort, 'asc'];
        
        lista = [...lista].sort((a, b) => {
          const valueA = (a as any)[field];
          const valueB = (b as any)[field];
          return direction === 'asc' 
            ? valueA > valueB ? 1 : -1
            : valueA < valueB ? 1 : -1;
        });
      }
      
      // Aplica paginação
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const items = lista.slice(start, end)
      const totalItems = lista.length
      const totalPages = Math.ceil(totalItems / pageSize)

      const response = {
        items,
        totalItems,
        currentPage: page,
        pageSize,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
      console.log('Resposta do serviço:', response)
      return response
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