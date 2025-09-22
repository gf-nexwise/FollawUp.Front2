export interface IPermissao {
    id: number;
    nome: string;
    key: string;
    descricao: string;
    ativo: boolean;
}

export interface IPermissaoFilter {
    page?: number;
    pageSize?: number;
    sort?: string;
    search?: string;
}