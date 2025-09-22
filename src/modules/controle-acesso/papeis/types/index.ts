export interface IPapelBase {
  id: string
  nome: string
  descricao: string
  ativo: boolean
}

export interface IPapelPermissao {
  id: string
  nome: string
  key: string
  descricao: string
}

export interface IPapelDetalhe extends IPapelBase {
  dataCriacao: string
  dataAtualizacao: string | null
  permissions: IPapelPermissao[]
}

export interface IPapelSelection {
  id: string
  nome: string
  descricao: string
}

export interface PapelFilter {
  page: number
  pageSize: number
  sortField?: string
  sortDirection?: 'asc' | 'desc'
}