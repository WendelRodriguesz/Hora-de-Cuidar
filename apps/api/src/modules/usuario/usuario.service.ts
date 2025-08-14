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
import { USUARIO_REPOSITORY } from 'src/common/constants';
import { format } from 'date-fns';
import { isBuffer } from 'util';

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

  async findBy(tipo: string, param: string, incluirDeletados: boolean = false) {
    const usuario = await this.repo.findBy(tipo, param, incluirDeletados);

    if (!usuario) {
      throw new NotFoundException(`Usuário com esse ${tipo} não encontrado`);
    }
    if (usuario.deleted_at) {
      throw new BadRequestException(
        `Usuário foi deletado em ${format(usuario.deleted_at, 'dd/MM/yyyy - HH:mm:ss')}`,
      );
    }
    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
    incluirDeletados: boolean = false,
  ) {
    const usuario = await this.repo.findBy("id",id, incluirDeletados);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (usuario.deleted_at) {
      throw new BadRequestException(
        `Usuário foi deletado em ${format(usuario.deleted_at, 'dd/MM/yyyy - HH:mm:ss')}`,
      );
    }
    return this.repo.update(id, incluirDeletados, updateUsuarioDto);
  }

  async delete(id: string) {
    const usuario = await this.repo.findBy("id",id, true);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (usuario.deleted_at) {
      throw new BadRequestException(
        `Usuário já foi deletado em ${format(usuario.deleted_at, 'dd/MM/yyyy - HH:mm:ss')}`,
      );
    }
    return this.repo.delete(id);
  }

  async recuperar(id: string) {
    const usuario = await this.repo.findBy("id",id, true);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (usuario.deleted_at === null) {
      throw new BadRequestException(
        `Usuário não foi deletado, não é possível recupera-lo')}`,
      );
    }
    return this.repo.recuperar(id);
  }

  async findAll(
    pag?: PaginacaoDto,
    cargo?: string,
    incluirDeletados: boolean = false,
  ) {
    const skip = pag?.skip ?? 0;
    const take = pag?.limit ?? 10;
    return this.repo.findAll({ skip, take, cargo }, incluirDeletados);
  }
}
