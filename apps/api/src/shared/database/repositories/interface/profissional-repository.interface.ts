export interface IProfissionalRepository {
  withTx(tx: any): IProfissionalRepository;

  create(data: {
    usuario_id: string;
    area_atuacao: string;
    status: 'ativo' | 'inativo' | 'aguardando_aprovacao';
    codigo: string;
  }): Promise<{ id: string; codigo: string; status: string }>;
}
