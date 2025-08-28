import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IProfissionalSolicitacaoRepository, IListarSolicitacoesParams } from './interface/profissional-solicitacao-repository.interface';

@Injectable()
export class ProfissionalSolicitacaoRepository implements IProfissionalSolicitacaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  private _tx: any;

  withTx(tx: any) { const r = new ProfissionalSolicitacaoRepository(this.prisma); r._tx = tx; return r; }
  private get db() { return this._tx ?? this.prisma; }

  create(data: any) {
    return this.db.profissionalSolicitacao.create({
      data,
      select: { id: true, status: true, created_at: true },
    });
  }

  findUniqueById(id: string) {
    return this.db.profissionalSolicitacao.findUnique({
      where: { id },
      select: { id: true, nome: true, area_atuacao: true, email: true, telefone: true, status: true },
    });
  }

  findFirstPendenteByEmail(email: string) {
    return this.db.profissionalSolicitacao.findFirst({
      where: { email, status: 'aguardando_aprovacao' },
      select: { id: true },
    });
  }

  async list(params: IListarSolicitacoesParams) {
    const { status, skip = 0, take = 10 } = params;
    return this.db.profissionalSolicitacao.findMany({
      where: { ...(status ? { status } : {}) },
      skip, take,
      orderBy: { created_at: 'desc' },
      select: { id: true, nome: true, email: true, area_atuacao: true, status: true, created_at: true },
    });
  }

  count(params: { status?: string }) {
    return this.db.profissionalSolicitacao.count({ where: { ...(params.status ? { status: params.status } : {}) } });
  }

  updateAprovada({ solicitacaoId, administradorId, usuarioId }: { solicitacaoId: string; administradorId: string; usuarioId: string }) {
    return this.db.profissionalSolicitacao.update({
      where: { id: solicitacaoId },
      data: {
        status: 'ativo',
        administrador: { connect: { id: administradorId } },
        usuario: { connect: { id: usuarioId } },
      },
    });
  }

  updateRecusada({ solicitacaoId, administradorId, motivo }: { solicitacaoId: string; administradorId: string; motivo?: string }) {
    return this.db.profissionalSolicitacao.update({
      where: { id: solicitacaoId },
      data: {
        status: 'inativo',
        administrador: { connect: { id: administradorId } },
        // opcional: salvar "motivo" em um campo extra se criar no schema
      },
    });
  }
}
