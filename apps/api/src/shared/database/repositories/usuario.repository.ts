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
  findById(id: string) {
    return this.prismaService.usuario.findUnique({ where: { id } });
  }
  findByCpf(cpf: string) {
    return this.prismaService.usuario.findUnique({ where: { cpf } });
  }
  findByEmail(email: string) {
    return this.prismaService.usuario.findUnique({ where: { email } });
  }
  update(id: string, data: Prisma.UsuarioUpdateInput) {
    return this.prismaService.usuario.update({ where: { id }, data });
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
  }) {
    const where = { deleted_at: null, ...(cargo && { cargo }) };
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
