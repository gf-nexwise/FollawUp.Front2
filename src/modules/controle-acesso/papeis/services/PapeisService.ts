import type { ApiResponse, PagedResponse } from '@/types/api/base/responses'
import type { IPapelBase, IPapelDetalhe, IPapelSelection, PapelFilter } from '../types'
import type { IUpsertRoleRequest, IRoleDetalheDto } from '../types/dtos'
import { BaseHttpService } from '@/services/base/BaseHttpService'

export class PapeisService extends BaseHttpService<IPapelBase, PapelFilter> {
  private static instance: PapeisService
  private readonly baseUrl: string

  private constructor() {
    super('/papeis')
    this.baseUrl = '/papeis'
  }

  public static getInstance(): PapeisService {
    if (!PapeisService.instance) {
      PapeisService.instance = new PapeisService()
    }
    return PapeisService.instance
  }

  public async listarPaginado(filter: PapelFilter): Promise<PagedResponse<IPapelBase>> {
    return this.getGrid(filter)
  }

  public async buscarPorId(id: string): Promise<IPapelDetalhe> {
    const response = await this.http.get(`${this.baseUrl}/${id}`, this.getRequestConfig())
    return response.data
  }

  public async listarSelection(): Promise<IPapelSelection[]> {
    const response = await this.http.get(`${this.baseUrl}/selection`, this.getRequestConfig())
    return response.data
  }

  public async vincularPermissao(papelId: string, permissaoId: string): Promise<void> {
    await this.http.post(`${this.baseUrl}/${papelId}/permissoes/${permissaoId}`, {}, this.getRequestConfig())
  }

  public async desvincularPermissao(papelId: string, permissaoId: string): Promise<void> {
    await this.http.delete(`${this.baseUrl}/${papelId}/permissoes/${permissaoId}`, this.getRequestConfig())
  }

  public async listarPermissoesDisponiveis(): Promise<any[]> {
    const response = await this.http.get('/permissions/selection', this.getRequestConfig())
    return response.data
  }

  public async listarPermissoesVinculadas(papelId: string): Promise<{ id: string, nome: string }[]> {
    const response = await this.http.get(`${this.baseUrl}/${papelId}/permissoes/selection`, this.getRequestConfig())
    return response.data
  }

  public async upsert(papel: IUpsertRoleRequest): Promise<IRoleDetalheDto> {
    const response = await this.http.post(this.baseUrl, papel, this.getRequestConfig())
    return response.data
  }
}