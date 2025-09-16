export interface IProfissionalRepository {
  withTx(tx: any): IProfissionalRepository;

  create(data: {
    usuario_id: string;
    area_atuacao: string;
    status: 'ativo'|'inativo'|'aguardando_aprovacao';
    codigo: string;
  }): Promise<{ id: string; codigo: string; status: string }>;

  findById(id: string, select?: { id?: boolean; status?: boolean }): Promise<{ id: string; status?: string } | null>;

  findByUsuarioId(usuarioId: string, select?: { id?: boolean }): Promise<{ id: string } | null>;

  list(params: {
    skip: number;
    take: number;
    where: {
      status?: 'ativo'|'inativo'|'aguardando_aprovacao';
      usuario_id?: string;
      area_atuacao_contains?: string; // filtro textual
    };
    includeUsuario?: boolean;
  }): Promise<Array<{
    id: string;
    usuario_id: string;
    area_atuacao: string;
    status: 'ativo'|'inativo'|'aguardando_aprovacao';
    codigo: string;
    usuario?: { id: string; nome: string; email: string };
  }>>;

  count(where: {
    status?: 'ativo'|'inativo'|'aguardando_aprovacao';
    usuario_id?: string;
    area_atuacao_contains?: string;
  }): Promise<number>;
  
}
