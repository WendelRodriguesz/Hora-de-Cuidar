import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IUsuarioRepository } from '../shared/database/repositories/interface/usuario-repository.interface';
import { hash } from 'bcryptjs';
import { PaginacaoDto } from '../common/dto/pagination.dto';
import { USUARIO_REPOSITORY } from 'src/common/constants';

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

  async findById(id: string) {
    const usuario = await this.repo.findById(id);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  async findByCpf(cpf: string) {
    const usuario = await this.repo.findByCpf(cpf);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  async findByEmail(email: string) {
    const usuario = await this.repo.findByEmail(email);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.repo.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.repo.update(id, updateUsuarioDto);
  }
  async delete(id: string) {
    const usuario = await this.repo.delete(id);
    return usuario;
  }

  async findAll(pag?: PaginacaoDto, cargo?: string) {
    const skip = pag?.skip ?? 0;
    const take = pag?.limit ?? 10;
    return this.repo.findAll({ skip, take, cargo });
  }
}
