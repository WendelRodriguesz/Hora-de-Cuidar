import { Prisma, Usuario } from '@prisma/client';

export interface IUsuarioRepository {
  me(incluirDeletados?: boolean): Promise<Omit<Usuario, 'senha'> | null>;
  create(data: Prisma.UsuarioCreateInput): Promise<Usuario>;
  findUnique(
    where: Prisma.UsuarioWhereUniqueInput,
    opts?: { includePassword?: boolean }
  ): Promise<(Omit<Usuario, 'senha'> & Partial<Pick<Usuario, 'senha'>>) | null>;
  update(
    id: string,
    data: Prisma.UsuarioUpdateInput,
    opts?: { includePassword?: boolean }
  ): Promise<(Omit<Usuario, 'senha'> & Partial<Pick<Usuario, 'senha'>>) >;
  delete(id: string): Promise<Usuario>;
  recuperar(id: string): Promise<Usuario>;
  findAll(options: {
    skip: number;
    take: number;
    cargo?: string;
    includeDeleted?: boolean;
  }): Promise<{ total: number; items: Omit<Usuario, 'senha'>[] }>;
}
