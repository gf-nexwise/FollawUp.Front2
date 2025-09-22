import type { ApiResponse, PagedResponse } from '@/types/api/base/responses'
import type { IPermissao, IPermissaoList, PermissaoFilter } from '../types'
import { BaseHttpService } from '@/services/base/BaseHttpService'

export class PermissoesService extends BaseHttpService<IPermissao, PermissaoFilter> {
  private static instance: PermissoesService

  private constructor() {
    super('/permissions')
  }

  public static getInstance(): PermissoesService {
    if (!PermissoesService.instance) {
      PermissoesService.instance = new PermissoesService()
    }
    return PermissoesService.instance
  }

  public async listarPaginado(filter: PermissaoFilter): Promise<PagedResponse<IPermissaoList>> {
    return this.getGrid(filter)
  }

  public async buscarPorId(id: string): Promise<ApiResponse<IPermissao>> {
    return this.getById(id)
  }

  public async criar(permissao: Omit<IPermissao, 'id' | 'key' | 'versao'>): Promise<IPermissao> {
    const response = await this.create(permissao)
    return response.data
  }

  public async atualizar(id: string, permissao: Partial<Omit<IPermissao, 'id' | 'key' | 'versao'>>): Promise<IPermissao> {
    const response = await this.update(id, permissao)
    return response.data
  }

  public async excluir(id: string): Promise<void> {
    await this.delete(id)
  }

  public async upsert(permissao: IPermissao): Promise<IPermissao> {
    if (permissao.id) {
      const response = await this.atualizar(
        permissao.id.toString(),
        {
          nome: permissao.nome,
          descricao: permissao.descricao,
          ativo: permissao.ativo
        }
      );
      return response;
    } else {
      return await this.criar({
        nome: permissao.nome,
        descricao: permissao.descricao,
        ativo: permissao.ativo
      });
    }
  }
}