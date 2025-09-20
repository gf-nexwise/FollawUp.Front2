export enum TipoAgrupador {
  FUNCIONALIDADE = 'FUNCIONALIDADE',
  PERMISSAO = 'PERMISSAO'
}

export interface IAgrupador {
  id: number;
  nome: string;
  descricao: string;
  tipo: TipoAgrupador;
  ativo: boolean;
}

export interface INovoAgrupador extends Omit<IAgrupador, 'id'> {}

export interface IAtualizarAgrupador extends Partial<INovoAgrupador> {
  tipo?: TipoAgrupador;
}