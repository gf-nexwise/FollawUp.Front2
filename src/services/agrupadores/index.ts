import { BaseHttpService } from '../base/BaseHttpService';
import type { IAgrupador, TipoAgrupador } from '@/types/agrupadores';
import type { AgrupadorFilter } from '@/types/api/agrupadores/filters';
import type { ApiResponse, PagedResponse } from '@/types/api/base/responses';

class AgrupadoresService extends BaseHttpService<IAgrupador, AgrupadorFilter> {
  constructor() {
    super('/api/agrupadores');
  }

  async listar(tipo: TipoAgrupador): Promise<IAgrupador[]> {
    const response = await this.getGrid({
      page: 1,
      pageSize: 1000, // Um número grande para trazer todos
      tipo,
      sort: 'nome' // Ordenação padrão
    });
    return response.data.items;
  }

  async listarPaginado(filter: AgrupadorFilter): Promise<PagedResponse<IAgrupador>> {
    const response = await this.getGrid(filter);
    return response.data;
  }

  async criar(agrupador: Omit<IAgrupador, 'id'>): Promise<IAgrupador> {
    const response = await this.create(agrupador);
    return response.data;
  }

  async atualizar(id: number, agrupador: Partial<IAgrupador>): Promise<IAgrupador> {
    const response = await this.update(id, agrupador);
    return response.data;
  }

  async excluir(id: number, tipo: TipoAgrupador): Promise<void> {
    await this.delete(id);
  }
}

export default new AgrupadoresService();