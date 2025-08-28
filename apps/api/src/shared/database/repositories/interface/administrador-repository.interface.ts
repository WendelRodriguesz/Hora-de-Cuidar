export interface IAdministradorRepository {
  withTx(tx: any): IAdministradorRepository;

  findByUsuarioId(usuarioId: string): Promise<{ id: string } | null>;
  findFirst(): Promise<{ id: string } | null>; // fallback (seed) para MVP
}
