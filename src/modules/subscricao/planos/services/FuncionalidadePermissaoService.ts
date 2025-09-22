import type { ApiResponse, PagedResponse } from '@/types/api/base/responses'
import type { 
  IFuncionalidadeBase, 
  IFuncionalidadeDetalhe, 
  IFuncionalidadeSelection,
  FuncionalidadeFilter 
} from '../types/funcionalidade-permissao'
import { BaseHttpService } from '@/services/base/BaseHttpService'

export class FuncionalidadePermissaoService extends BaseHttpService<IFuncionalidadeDetalhe, FuncionalidadeFilter> {
  private static instance: FuncionalidadePermissaoService
  private readonly baseUrl: string

  private constructor() {
    super('/funcionalidades')
    this.baseUrl = '/funcionalidades'
  }

  public static getInstance(): FuncionalidadePermissaoService {
    if (!FuncionalidadePermissaoService.instance) {
      FuncionalidadePermissaoService.instance = new FuncionalidadePermissaoService()
    }
    return FuncionalidadePermissaoService.instance
  }

  public async listarPaginado(filter: FuncionalidadeFilter): Promise<PagedResponse<IFuncionalidadeBase>> {
    return this.getGrid(filter)
  }

  public async buscarPorId(id: string): Promise<ApiResponse<IFuncionalidadeDetalhe>> {
    return this.getById(id) as Promise<ApiResponse<IFuncionalidadeDetalhe>>
  }

  public async listarSelection(): Promise<ApiResponse<IFuncionalidadeSelection[]>> {
    const response = await this.http.get<ApiResponse<IFuncionalidadeSelection[]>>(`${this.baseUrl}/selection`)
    return response.data
  }

  public async vincularPermissao(funcionalidadeId: string, permissaoId: string): Promise<void> {
    await this.http.post(`${this.baseUrl}/${funcionalidadeId}/permissoes/${permissaoId}`)
  }

  public async desvincularPermissao(funcionalidadeId: string, permissaoId: string): Promise<void> {
    await this.http.delete(`${this.baseUrl}/${funcionalidadeId}/permissoes/${permissaoId}`)
  }
}