import type { BaseFilter } from '@/types/api/base/filters'

export interface FuncionalidadeFilter extends BaseFilter {
  nome?: string;
  ativo?: boolean;
}

export interface IFuncionalidadeList {
  id: string
  nome: string
  key: string
  ativo: boolean
}

export interface IFuncionalidade extends IFuncionalidadeList {
  descricao: string
  categoria: string
  tipoLimite: string
  unidadeMedida: string
  ordem: number
  visivel: boolean
  versao: number
}