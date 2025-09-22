import type { ApiResponse, PagedResponse } from '@/types/api/base/responses'
import type { IFuncionalidade, IFuncionalidadeList, FuncionalidadeFilter } from '@/modules/subscricao/planos/types'
import { BaseHttpService } from '@/services/base/BaseHttpService'

export class FuncionalidadesService extends BaseHttpService<IFuncionalidade, FuncionalidadeFilter> {
  private static instance: FuncionalidadesService

  private constructor() {
    super('/funcionalidades')
  }

  public static getInstance(): FuncionalidadesService {
    if (!FuncionalidadesService.instance) {
      FuncionalidadesService.instance = new FuncionalidadesService()
    }
    return FuncionalidadesService.instance
  }

  public async listarPaginado(filter: FuncionalidadeFilter): Promise<PagedResponse<IFuncionalidadeList>> {
    return this.getGrid(filter)
  }

  public async buscarPorId(id: string): Promise<IFuncionalidade> {
    const response = await this.getById(id)
    return response.data
  }

  public async criar(funcionalidade: Omit<IFuncionalidade, 'id' | 'key' | 'versao'>): Promise<IFuncionalidade> {
    const response = await this.create(funcionalidade)
    return response.data
  }

  public async atualizar(id: string, funcionalidade: Partial<Omit<IFuncionalidade, 'id' | 'key' | 'versao'>>): Promise<IFuncionalidade> {
    const response = await this.update(id, funcionalidade)
    return response.data
  }

  public async excluir(id: string): Promise<void> {
    await this.delete(id)
  }
}