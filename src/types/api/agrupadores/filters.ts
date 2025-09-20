import type { BaseFilter } from '../base/filters';
import type { TipoAgrupador } from '@/types/agrupadores';

export interface AgrupadorFilter extends BaseFilter {
  tipo?: TipoAgrupador;
}