import { Prisma, Usuario } from '@prisma/client';

export interface IUsuarioRepository {
  create(data: Prisma.UsuarioCreateInput): Promise<Usuario>;
  findBy(tipo: string, param: string, incluirDeletados: boolean): Promise<Usuario | null>;
  update(id: string,incluirDeletados: boolean, data: Prisma.UsuarioUpdateInput): Promise<Usuario>;
  delete(id: string): Promise<Usuario>;
  recuperar(id: string): Promise<Usuario>;
  findAll(options: {
    skip: number;
    take: number;
    cargo?: string;
  }, incluirDeletados: boolean): Promise<{ total: number; items: Omit<Usuario, 'senha'>[] }>;
}
