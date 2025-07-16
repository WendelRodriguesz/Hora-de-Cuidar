import { Prisma, Usuario } from '@prisma/client';

export interface IUsuarioRepository {
  create(data: Prisma.UsuarioCreateInput): Promise<Usuario>;
  findById(id: string): Promise<Usuario | null>;
  findByCpf(cpf: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  update(id: string, data: Prisma.UsuarioUpdateInput): Promise<Usuario>;
  delete(id: string): Promise<Usuario>;
  findAll(options: {
    skip: number;
    take: number;
    cargo?: string;
  }): Promise<{ total: number; items: Omit<Usuario, 'senha'>[] }>;
}
