export interface IUpsertRoleRequest {
  id?: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface IRolePermissionDto {
  id: string;
  nome: string;
  key: string;
  descricao?: string;
}

export interface IRoleDetalheDto {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao?: string | null;
  permissions: IRolePermissionDto[];
}