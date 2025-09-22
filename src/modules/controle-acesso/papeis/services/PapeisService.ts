import type { ApiResponse, PagedResponse } from '@/types/api/base/responses'
import type { IPapelBase, IPapelDetalhe, IPapelSelection, PapelFilter } from '../types'
import { BaseHttpService } from '@/services/base/BaseHttpService'

export class PapeisService extends BaseHttpService<IPapelDetalhe, PapelFilter> {
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
    if (typeof id !== 'string') {
      throw new Error('ID do papel deve ser um GUID')
    }
    const response = await this.getById(id)
    return response.data
  }

  public async listarSelection(): Promise<IPapelSelection[]> {
    const response = await this.http.get<ApiResponse<IPapelSelection[]>>(`${this.baseUrl}/selection`)
    return response.data
  }

  public async vincularPermissao(papelId: string, permissaoId: string): Promise<void> {
    await this.http.post(`${this.baseUrl}/${papelId}/permissoes/${permissaoId}`)
  }

  public async desvincularPermissao(papelId: string, permissaoId: string): Promise<void> {
    await this.http.delete(`${this.baseUrl}/${papelId}/permissoes/${permissaoId}`)
  }
}