import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: CreateAuthDto) {
    const usuario =  await this.authService.validarUsuario(dto);
    if(!usuario){
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }
    return this.authService.login(usuario);
  }
}
