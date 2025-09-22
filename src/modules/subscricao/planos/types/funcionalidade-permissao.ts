export interface IFuncionalidadeBase {
  id: string
  nome: string
  descricao: string
  ativo: boolean
}

export interface IFuncionalidadePermissao {
  id: string
  nome: string
  key: string
  descricao: string
}

export interface IFuncionalidadeDetalhe extends IFuncionalidadeBase {
  dataCriacao: string
  dataAtualizacao: string | null
  permissions: IFuncionalidadePermissao[]
}

export interface IFuncionalidadeSelection {
  id: string
  nome: string
  descricao: string
}

export interface FuncionalidadeFilter {
  page: number
  pageSize: number
  sortField?: string
  sortDirection?: 'asc' | 'desc'
}