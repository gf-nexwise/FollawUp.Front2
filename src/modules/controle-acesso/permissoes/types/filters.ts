import { BaseFilter } from '@/types/api/base/filters'

export interface IPermissaoFilter extends BaseFilter {
  descricao?: string
  nome?: string
  papelId?: number
  funcionalidadeId?: number
}