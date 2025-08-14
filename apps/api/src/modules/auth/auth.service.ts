import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateAuthDto } from './dto/create-auth.dto';
import { IUsuarioRepository } from 'src/shared/database/repositories/interface/usuario-repository.interface';
import { USUARIO_REPOSITORY } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USUARIO_REPOSITORY) private readonly usuarioRepo: IUsuarioRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(login: CreateAuthDto) {
    const usuario = await this.usuarioRepo.findUnique(
      { email: login.email },
      { includePassword: true }
    );

    if (!usuario || usuario.deleted_at || !login.senha || !(usuario as any).senha) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const ok = await bcrypt.compare(login.senha, (usuario as any).senha);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');

    const { senha, ...safe } = usuario as any;
    return safe;
  }

  async login(usuario: any) {
    const payload = { sub: usuario.id, email: usuario.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
