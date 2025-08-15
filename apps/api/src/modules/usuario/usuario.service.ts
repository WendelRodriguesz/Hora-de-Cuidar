import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IUsuarioRepository } from '../../shared/database/repositories/interface/usuario-repository.interface';
import { hash } from 'bcryptjs';
import { PaginacaoDto } from '../../common/dto/pagination.dto';
import { USUARIO_REPOSITORY } from 'src/common/constants/constants';
import { format } from 'date-fns';
import { Cargo, Prisma, Usuario } from '@prisma/client';

type Actor = { id: string; cargo: Cargo };

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly repo: IUsuarioRepository,
  ) {}

  private async findUnique(
    where: Prisma.UsuarioWhereUniqueInput,
    includeDeleted = false,
  ) {
    const usuario = await this.repo.findUnique(where);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    if (!includeDeleted && usuario.deleted_at) {
      const quando = format(usuario.deleted_at, 'dd/MM/yyyy - HH:mm:ss');
      throw new BadRequestException(`Usuário foi deletado em ${quando}`);
    }
    return usuario;
  }

  private assertCanView(actor: Actor, target: Pick<Usuario, 'id' | 'cargo'>) {
   
    if (target.cargo === Cargo.ADMIN && actor.id !== target.id) {
      throw new ForbiddenException('Sem permissão para ver dados de administradores');
    }
    
    if (target.cargo === Cargo.PROFISSIONAL && actor.cargo === Cargo.PROFISSIONAL && actor.id !== target.id) {
      throw new ForbiddenException('Profissional não pode ver dados de outros profissionais');
    }
  }

  async create(dto: CreateUsuarioDto) {
    const senha = await hash(dto.senha, 10);
    return this.repo.create({ ...dto, senha });
  }

  async findById(actor: Actor, id: string, includeDeleted = false) {
    const u = await this.findUnique({ id }, includeDeleted);
    this.assertCanView(actor, u);
    return u;
  }

  async findByCpf(actor: Actor, cpf: string, includeDeleted = false) {
    const u = await this.findUnique({ cpf }, includeDeleted);
    this.assertCanView(actor, u);
    return u;
  }

  async findByEmail(actor: Actor, email: string, includeDeleted = false) {
    const u = await this.findUnique({ email }, includeDeleted);
    this.assertCanView(actor, u);
    return u;
  }

  async update(actor: Actor, id: string, dto: UpdateUsuarioDto) {
    const u = await this.findUnique({ id }, false);
    this.assertCanView(actor, u); 
    return this.repo.update(id, dto);
  }

  async delete(actor: Actor, id: string) {
    const u = await this.findUnique({ id }, true);
    this.assertCanView(actor, u);
    if (u.deleted_at) {
      const quando = format(u.deleted_at, 'dd/MM/yyyy - HH:mm:ss');
      throw new BadRequestException(`Usuário já foi deletado em ${quando}`);
    }
    return this.repo.delete(id);
  }

  async recuperar(actor: Actor, id: string) {
    const u = await this.findUnique({ id }, true);
    this.assertCanView(actor, u);
    if (u.deleted_at === null) {
      throw new BadRequestException('Usuário não está deletado');
    }
    return this.repo.recuperar(id);
  }

  async findAll(actor: Actor, pag?: PaginacaoDto, cargo?: string, includeDeleted = false) {
    const skip = pag?.skip ?? 0;
    const take = pag?.limit ?? 10;

    const { items, total } = await this.repo.findAll({ skip, take, cargo, includeDeleted });

    const filtered = items.filter((u) => {
      if (u.cargo === Cargo.ADMIN && actor.id !== u.id) return false;
      if (u.cargo === Cargo.PROFISSIONAL && actor.cargo === Cargo.PROFISSIONAL && actor.id !== u.id) return false;
      return true;
    });

    return { total: filtered.length, items: filtered };
  }
}
