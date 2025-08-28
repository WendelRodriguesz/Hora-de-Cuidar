export interface IListarSolicitacoesParams {
  status?: 'aguardando_aprovacao' | 'ativo' | 'inativo';
  skip?: number;
  take?: number;
}

export interface IProfissionalSolicitacaoRepository {
  withTx(tx: any): IProfissionalSolicitacaoRepository;

  create(data: {
    nome: string;
    area_atuacao: string;
    email: string;
    telefone: string;
    documento_url: string;
    status?: 'aguardando_aprovacao' | 'ativo' | 'inativo';
  }): Promise<{ id: string; status: string; created_at: Date }>;

  findUniqueById(id: string): Promise<{
    id: string;
    nome: string;
    area_atuacao: string;
    email: string;
    telefone: string;
    status: 'aguardando_aprovacao' | 'ativo' | 'inativo';
  } | null>;

  findFirstPendenteByEmail(email: string): Promise<{ id: string } | null>;

  list(params: IListarSolicitacoesParams): Promise<
    Array<{ id: string; nome: string; email: string; area_atuacao: string; status: string; created_at: Date }>
  >;

  count(params: { status?: 'aguardando_aprovacao' | 'ativo' | 'inativo' }): Promise<number>;

  updateAprovada(params: {
    solicitacaoId: string;
    administradorId: string;
    usuarioId: string;
  }): Promise<void>;

  updateRecusada(params: {
    solicitacaoId: string;
    administradorId: string;
    motivo?: string;
  }): Promise<void>;
}
