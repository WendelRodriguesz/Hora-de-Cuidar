import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IUsuarioRepository } from '../../shared/database/repositories/interface/usuario-repository.interface';
import { hash } from 'bcryptjs';
import { PaginacaoDto } from '../../common/dto/pagination.dto';
import { USUARIO_REPOSITORY } from 'src/common/constants/constants';
import { format } from 'date-fns';
import { Prisma } from '@prisma/client';

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
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (!includeDeleted && usuario.deleted_at) {
      const quando = format(usuario.deleted_at, 'dd/MM/yyyy - HH:mm:ss');
      throw new BadRequestException(`Usuário foi deletado em ${quando}`);
    }
    return usuario;
  }

  async create(dto: CreateUsuarioDto) {
    const senha = await hash(dto.senha, 10);
    return this.repo.create({ ...dto, senha });
  }

  findById(id: string, includeDeleted = false) {
    return this.findUnique({ id }, includeDeleted);
  }

  findByCpf(cpf: string, includeDeleted = false) {
    return this.findUnique({ cpf }, includeDeleted);
  }

  findByEmail(email: string, includeDeleted = false) {
    return this.findUnique({ email }, includeDeleted);
  }

  async update(id: string, dto: UpdateUsuarioDto) {
    await this.findUnique({ id }, false);
    return this.repo.update(id, dto);
  }

  async delete(id: string) {
    const u = await this.findUnique({ id }, true);
    if (u.deleted_at) {
      const quando = format(u.deleted_at, 'dd/MM/yyyy - HH:mm:ss');
      throw new BadRequestException(`Usuário já foi deletado em ${quando}`);
    }
    return this.repo.delete(id);
  }

  async recuperar(id: string) {
    const u = await this.findUnique({ id }, true);
    if (u.deleted_at === null) {
      throw new BadRequestException('Usuário não está deletado');
    }
    return this.repo.recuperar(id);
  }

  async findAll(pag?: PaginacaoDto, cargo?: string, includeDeleted = false) {
    const skip = pag?.skip ?? 0;
    const take = pag?.limit ?? 10;
    return this.repo.findAll({ skip, take, cargo, includeDeleted });
  }
}
