import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IProfissionalRepository } from './interface/profissional-repository.interface';

@Injectable()
export class ProfissionalRepository implements IProfissionalRepository {
  private _tx?: any;
  constructor(private readonly prisma: PrismaService) {}

  withTx(tx: any): IProfissionalRepository {
    const r = new ProfissionalRepository(this.prisma);
    (r as any)._tx = tx;
    return r;
  }

  private get db() {
    return this._tx ?? this.prisma;
  }

  async create(data: {
    usuario_id: string;
    area_atuacao: string;
    status: 'ativo' | 'inativo' | 'aguardando_aprovacao';
    codigo: string;
  }): Promise<{ id: string; codigo: string; status: string }> {
    return this.db.profissional.create({
      data,
      select: { id: true, codigo: true, status: true },
    });
  }

  async findById(id: string, select?: { id?: boolean; status?: boolean }) {
    return this.db.profissional.findUnique({
      where: { id },
      select: select ?? { id: true, status: true },
    });
  }

  async findByUsuarioId(usuarioId: string, select?: { id?: boolean }) {
    return this.db.profissional.findFirst({
      where: { usuario_id: usuarioId },
      select: select ?? { id: true },
    });
  }

  async list(params: {
    skip: number; take: number; where: { status?: any; usuario_id?: string; area_atuacao_contains?: string };
    includeUsuario?: boolean;
  }) {
    const { skip, take, where, includeUsuario } = params;
    return this.db.profissional.findMany({
      skip,
      take,
      orderBy: { codigo: 'asc' },
      where: {
        status: where.status,
        usuario_id: where.usuario_id,
        area_atuacao: where.area_atuacao_contains ? { contains: where.area_atuacao_contains, mode: 'insensitive' } : undefined,
        // segurança extra: não retornar vinculados a usuários soft-deletados
        usuario: { deleted_at: null },
      },
      select: {
        id: true, usuario_id: true, area_atuacao: true, status: true, codigo: true,
        ...(includeUsuario ? { usuario: { select: { id: true, nome: true, email: true } } } : {}),
      },
    });
  }

  async count(where: { status?: any; usuario_id?: string; area_atuacao_contains?: string }) {
    return this.db.profissional.count({
      where: {
        status: where.status,
        usuario_id: where.usuario_id,
        area_atuacao: where.area_atuacao_contains ? { contains: where.area_atuacao_contains, mode: 'insensitive' } : undefined,
        usuario: { deleted_at: null },
      },
    });
  }
}
