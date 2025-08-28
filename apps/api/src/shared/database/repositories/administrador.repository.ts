import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IAdministradorRepository } from './interface/administrador-repository.interface';

@Injectable()
export class AdministradorRepository implements IAdministradorRepository {
  private _tx?: any;
  constructor(private readonly prisma: PrismaService) {}

  withTx(tx: any): IAdministradorRepository {
    const r = new AdministradorRepository(this.prisma);
    (r as any)._tx = tx;
    return r;
  }

  private get db() {
    return this._tx ?? this.prisma;
  }

  async findByUsuarioId(usuarioId: string): Promise<{ id: string } | null> {
    return this.db.administrador.findUnique({
      where: { usuario_id: usuarioId },
      select: { id: true },
    });
  }

  async findFirst(): Promise<{ id: string } | null> {
    return this.db.administrador.findFirst({
      select: { id: true },
    });
  }
}
