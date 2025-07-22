import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IUsuarioRepository } from '../shared/database/repositories/interface/usuario-repository.interface';
import { hash } from 'bcryptjs';
import { PaginacaoDto } from '../common/dto/pagination.dto';
import { USUARIO_REPOSITORY } from 'src/common/constants';
import { format } from 'date-fns';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly repo: IUsuarioRepository,
  ) {}
  async create(createUserdto: CreateUsuarioDto) {
    const hashedPassword = await hash(createUserdto.senha, 10);
    return this.repo.create({
      ...createUserdto,
      senha: hashedPassword,
      cargo: createUserdto.cargo,
    });
  }

  async findById(id: string, incluirDeletados: boolean = false) {
    const usuario = await this.repo.findById(id, incluirDeletados);

    if (!usuario) {
       throw new NotFoundException('Usuário não encontrado');
    }
    if (usuario.deleted_at) {
      throw new BadRequestException(`Usuário foi deletado em ${format(usuario.deleted_at, 'dd/MM/yyyy - HH:mm:ss')}`);
    }
    return usuario;
  }

  async findByCpf(cpf: string, incluirDeletados: boolean = false) {
    const usuario = await this.repo.findByCpf(cpf, incluirDeletados);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (usuario.deleted_at) {
      throw new BadRequestException(`Usuário foi deletado em ${format(usuario.deleted_at, 'dd/MM/yyyy - HH:mm:ss')}`);
    }
    return usuario;
  }

  async findByEmail(email: string, incluirDeletados: boolean = false) {
    const usuario = await this.repo.findByEmail(email, incluirDeletados);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (usuario.deleted_at) {
      throw new BadRequestException(`Usuário foi deletado em ${format(usuario.deleted_at, 'dd/MM/yyyy - HH:mm:ss')}`);
    }
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto, incluirDeletados: boolean = false) {
    const usuario = await this.repo.findById(id,true);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (usuario.deleted_at) {
      throw new BadRequestException(`Usuário foi deletado em ${format(usuario.deleted_at, 'dd/MM/yyyy - HH:mm:ss')}`);
    }
    return this.repo.update(id, incluirDeletados, updateUsuarioDto);
  }

  async delete(id: string) {
    const usuario = await this.repo.delete(id);
    return usuario;
  }

  async findAll(pag?: PaginacaoDto, cargo?: string, incluirDeletados: boolean = false) {
    const skip = pag?.skip ?? 0;
    const take = pag?.limit ?? 10;
    return this.repo.findAll({ skip, take, cargo }, incluirDeletados);
  }
}
