import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, Cargo } from '@prisma/client';
import { IUsuarioRepository } from './interface/usuario-repository.interface';
import { usuarioSelect, usuarioComSenhaSelect } from '../selects/usuario.select';

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async me(incluirDeletados = false){
    const user = await this.prismaService.usuario.findFirst({
      where: { deleted_at: incluirDeletados ? undefined : null },
      select: usuarioSelect,
    });
    return user || null;
  }

  create(data: Prisma.UsuarioCreateInput) {
    return this.prismaService.usuario.create({ data });
  }

  findUnique(where: Prisma.UsuarioWhereUniqueInput, opts?: { includePassword?: boolean }) {
    return this.prismaService.usuario.findUnique({
      where,
      select: opts?.includePassword ? usuarioComSenhaSelect : usuarioSelect,
    });
  }

  update(id: string, data: Prisma.UsuarioUpdateInput, opts?: { includePassword?: boolean }) {
    return this.prismaService.usuario.update({
      where: { id },
      data,
      select: opts?.includePassword ? usuarioComSenhaSelect : usuarioSelect,
    });
  }

  delete(id: string) {
    return this.prismaService.usuario.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  recuperar(id: string) {
    return this.prismaService.usuario.update({
      where: { id },
      data: { deleted_at: null },
    });
  }

  async findAll({ skip, take, cargo, includeDeleted }: {
    skip: number; take: number; cargo?: string; includeDeleted?: boolean;
  }) {
    const where: Prisma.UsuarioWhereInput = {
      ...(includeDeleted ? {} : { deleted_at: null }),
      ...(cargo ? { cargo: cargo as Cargo } : {}),
    };

    const [total, items] = await Promise.all([
      this.prismaService.usuario.count({ where }),
      this.prismaService.usuario.findMany({
        skip, take, where,
        select: usuarioSelect,
      }),
    ]);

    return { total, items };
  }
}
