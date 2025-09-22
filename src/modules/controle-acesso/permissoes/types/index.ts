export interface IPermissao {
    id: number;
    nome: string;
    key: string;
    descricao: string;
    ativo: boolean;
}

export interface IPermissaoList extends IPermissao {}

export { IPermissaoFilter } from './filters'