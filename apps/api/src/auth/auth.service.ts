import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { USUARIO_SERVICE } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USUARIO_SERVICE) private userService: UsuarioService,
    private jwtService: JwtService,
  ){}

  async validarUsuario(login: CreateAuthDto): Promise<any> {
    const usuario = await this.userService.findByEmail(login.email);
    if (usuario && await bcrypt.compare(login.senha, usuario.senha)) {
      const {senha, ...result} = usuario;
      return result;
    }
    return null;
  }

  async login(usuario: any) {
    const payload = { sub: usuario.id, email: usuario.email };
    return { access_token: this.jwtService.sign(payload) };
  }

}
