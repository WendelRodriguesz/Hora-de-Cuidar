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
}
