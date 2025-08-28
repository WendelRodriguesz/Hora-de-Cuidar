import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { IProfissionalSolicitacaoRepository } from '../../shared/database/repositories/interface/profissional-solicitacao-repository.interface';
import { IAdministradorRepository } from '../../shared/database/repositories/interface/administrador-repository.interface';
import { IUsuarioRepository } from '../../shared/database/repositories/interface/usuario-repository.interface';
import { IProfissionalRepository } from '../../shared/database/repositories/interface/profissional-repository.interface';
import { REPO_TOKENS } from '../../shared/database/repositories/tokens';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

type Cargo = 'PACIENTE' | 'PROFISSIONAL' | 'ADMIN';

function gerarSenha(tam = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#%!';
  return Array.from({ length: tam }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

@Injectable()
export class ProfissionalService {
  constructor(
    private readonly prisma: PrismaService,
     @Inject(REPO_TOKENS.PROF_SOLIC)
    private readonly solicitacaoRepo: IProfissionalSolicitacaoRepository,

    @Inject(REPO_TOKENS.ADMIN)
    private readonly adminRepo: IAdministradorRepository,

    @Inject(REPO_TOKENS.USUARIO)
    private readonly usuarioRepo: IUsuarioRepository,

    @Inject(REPO_TOKENS.PROF)
    private readonly profissionalRepo: IProfissionalRepository,
  ) {}

  // ====== SOLICITAR ======
  async solicitar(dto: {
    nome: string; area_atuacao: string; email: string; telefone: string; documento_url: string;
  }) {
    // 1) e-mail já usado por usuário?
    const jaUsuario = await this.usuarioRepo.findUnique({ email: dto.email }, { includePassword: false });
    if (jaUsuario) throw new BadRequestException('E-mail já cadastrado como usuário.');

    // 2) já existe solicitação "aguardando" para este e-mail?
    const pendente = await this.solicitacaoRepo.findFirstPendenteByEmail(dto.email);
    if (pendente) throw new BadRequestException('Já existe solicitação pendente para este e-mail.');

    // 3) cria
    return this.solicitacaoRepo.create({
      nome: dto.nome,
      area_atuacao: dto.area_atuacao,
      email: dto.email,
      telefone: dto.telefone,
      documento_url: dto.documento_url,
      status: 'aguardando_aprovacao',
    });
  }

  // ====== LISTAR ======
  async listarSolicitacoes(q: { status?: 'aguardando_aprovacao' | 'ativo' | 'inativo'; page?: number; take?: number }) {
    const page = q.page ?? 1;
    const take = q.take ?? 10;
    const skip = (page - 1) * take;
    const [items, total] = await Promise.all([
      this.solicitacaoRepo.list({ status: q.status, skip, take }),
      this.solicitacaoRepo.count({ status: q.status }),
    ]);
    return { items, meta: { page, take, total } };
  }

  // ====== APROVAR ======
  async aprovar(id: string, dto: { senha?: string }, actor: { id: string; cargo: Cargo }) {
    if (actor.cargo !== 'ADMIN') throw new ForbiddenException('Apenas administradores podem aprovar.');

    const solicitacao = await this.solicitacaoRepo.findUniqueById(id);
    if (!solicitacao) throw new NotFoundException('Solicitação não encontrada.');
    if (solicitacao.status !== 'aguardando_aprovacao') {
      throw new BadRequestException('Solicitação não está pendente.');
    }

    // resolve Administrador.id do actor (usuario logado)
    const administradorId = await this.getAdministradorIdPorUsuario(actor.id);

    // garante que o e-mail não foi usado enquanto aguardava
    const emailJaExiste = await this.usuarioRepo.findUnique({ email: solicitacao.email }, { includePassword: false });
    if (emailJaExiste) throw new BadRequestException('E-mail já utilizado por outro usuário.');

    const senha = dto.senha?.trim() || gerarSenha();
    const hash = await bcrypt.hash(senha, Number(process.env.BCRYPT_SALT_ROUNDS ?? 10));

    // transação
    const result = await this.prisma.$transaction(async (tx) => {
      const profissionalRepoTx = this.profissionalRepo.withTx(tx);
      const solicitacaoRepoTx = this.solicitacaoRepo.withTx(tx);

      // ATENÇÃO: teu schema obriga campos mínimos de Usuario; aqui uso placeholders (ajusta pro teu fluxo)
      const usuario = await tx.usuario.create({
        data: {
          nome: solicitacao.nome,
          email: solicitacao.email,
          senha: hash,
          telefone: solicitacao.telefone,
          data_nasc: new Date('1990-01-01'),
          sexo: 'N',
          cpf: String(Date.now()).slice(-11).padStart(11, '0'),
          cargo: 'PROFISSIONAL',
        }, select: { id: true, nome: true, email: true, cargo: true }
      });

      const profissional = await profissionalRepoTx.create({
        usuario_id: usuario.id,
        area_atuacao: solicitacao.area_atuacao,
        status: 'ativo',
        codigo: 'P' + Date.now(),
      });

      await solicitacaoRepoTx.updateAprovada({
        solicitacaoId: id,
        administradorId,
        usuarioId: usuario.id,
      });

      return { usuario, profissional };
    });

    return { ...result, senhaGerada: dto.senha ? undefined : senha };
  }

  // ====== RECUSAR ======
  async recusar(id: string, dto: { motivo?: string }, actor: { id: string; cargo: Cargo }) {
    if (actor.cargo !== 'ADMIN') throw new ForbiddenException('Apenas administradores podem recusar.');

    const solicitacao = await this.solicitacaoRepo.findUniqueById(id);
    if (!solicitacao) throw new NotFoundException('Solicitação não encontrada.');
    if (solicitacao.status !== 'aguardando_aprovacao') {
      throw new BadRequestException('Solicitação não está pendente.');
    }

    const administradorId = await this.getAdministradorIdPorUsuario(actor.id);

    await this.prisma.$transaction(async (tx) => {
      await this.solicitacaoRepo.withTx(tx).updateRecusada({
        solicitacaoId: id,
        administradorId,
        motivo: dto.motivo,
      });
    });

    return { id, status: 'inativo' };
  }

  // ====== Helper ======
  private async getAdministradorIdPorUsuario(usuarioId: string): Promise<string> {
    const admin = await this.adminRepo.findByUsuarioId(usuarioId);
    if (!admin) {
      const fallback = await this.adminRepo.findFirst();
      if (!fallback) throw new InternalServerErrorException('Usuário ADMIN sem registro em administradores.');
      return fallback.id;
    }
    return admin.id;
  }
}
