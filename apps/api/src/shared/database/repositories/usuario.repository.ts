import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Cargo, Prisma } from '@prisma/client';
import { IUsuarioRepository } from './interface/usuario-repository.interface';

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly prismaService: PrismaService) {}
  create(data: Prisma.UsuarioCreateInput) {
    return this.prismaService.usuario.create({ data });
  }
  findById(id: string, incluirDeletados: boolean) {
    const where = incluirDeletados ? { id } : { id, deleted_at: null }
    return this.prismaService.usuario.findUnique({ where });
  }
  findByCpf(cpf: string, incluirDeletados: boolean) {
    const where = incluirDeletados ? { cpf } : { cpf, deleted_at: null }
    return this.prismaService.usuario.findUnique({ where });
  }
  findByEmail(email: string, incluirDeletados: boolean) {
    const where = incluirDeletados ? { email } : { email, deleted_at: null }
    return this.prismaService.usuario.findUnique({ where });
  }
  update(id: string, incluirDeletados: boolean, data: Prisma.UsuarioUpdateInput) {
    const where = incluirDeletados ? { id } : { id, deleted_at: null }
    return this.prismaService.usuario.update({ where, data });
  }
  async delete(id: string) {
    return this.prismaService.usuario.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async findAll({
    skip,
    take,
    cargo,
  }: {
    skip: number;
    take: number;
    cargo?: Cargo;
  }, incluirDeletados: boolean) {
    const where = incluirDeletados ? { ...(cargo && { cargo }) } : { deleted_at: null, ...(cargo && { cargo }) };
    const [total, items] = await Promise.all([
      this.prismaService.usuario.count({ where }),
      this.prismaService.usuario.findMany({
        skip,
        take,
        where,
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          data_nasc: true,
          sexo: true,
          cpf: true,
          cargo: true,
          endereco_id: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
        },
      }),
    ]);
    return { total, items };
  }
}
