/**
 * Tipos de agrupadores disponíveis no sistema
 */
export enum TipoAgrupador {
  FUNCIONALIDADE = 'FUNCIONALIDADE',
  PERMISSAO = 'PERMISSAO'
}

/**
 * Estrutura base de um agrupador
 */
export interface IAgrupador {
  id: number
  nome: string
  descricao: string
  tipo: TipoAgrupador
  ativo: boolean
}

/**
 * Payload para criação de um novo agrupador
 */
export type INovoAgrupador = Omit<IAgrupador, 'id'>

/**
 * Payload para atualização de um agrupador existente
 */
export type IAtualizarAgrupador = Partial<INovoAgrupador>

/**
 * Interface para a coluna da grid de agrupadores
 */
export interface IAgrupadorColuna {
  field: keyof IAgrupador | null
  label: string
  type?: 'status' | 'actions'
  width?: string
  statusField?: keyof IAgrupador
}

/**
 * Configuração das colunas da grid de agrupadores
 */
export const COLUNAS_AGRUPADOR: IAgrupadorColuna[] = [
  { field: 'nome', label: 'Nome' },
  { field: 'descricao', label: 'Descrição' },
  { field: 'ativo', label: 'Status', type: 'status', width: '120px' },
  { field: null, type: 'actions', label: 'Ações', width: '100px' }
]

/**
 * Interface para os filtros de pesquisa de agrupadores
 */
export interface IAgrupadorFiltro {
  tipo: TipoAgrupador
  ativo?: boolean
  termo?: string
}

/**
 * Estado do formulário de agrupador
 */
export interface IAgrupadorFormState {
  showForm: boolean
  isEditing: boolean
  formData: INovoAgrupador
}

/**
 * Interface para as notificações relacionadas a agrupadores
 */
export interface IAgrupadorNotification {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}