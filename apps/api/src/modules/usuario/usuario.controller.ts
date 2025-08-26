import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query,
  Inject, UseGuards, DefaultValuePipe, ParseBoolPipe,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { USUARIO_SERVICE } from 'src/common/constants/constants';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Cargo } from '@prisma/client';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { UsuarioLogado } from 'src/common/constants/decorators/usuarioLogado.decorator';
import { MinRole } from 'src/common/constants/decorators/min-role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuario')
export class UsuarioController {
  constructor(@Inject(USUARIO_SERVICE) private readonly usuarioService: UsuarioService) {}

  @MinRole(Cargo.ADMIN)
  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.create(dto);
  }

  @MinRole(Cargo.PROFISSIONAL)
  @Get()
  findAll(
    @UsuarioLogado() user: { id: string; cargo: Cargo },
    @Query() pag: PaginacaoDto,
    @Query('cargo') cargo?: Cargo,
    @Query('incluirDeletados', new DefaultValuePipe(false), ParseBoolPipe) incluirDeletados?: boolean,
  ) {
    return this.usuarioService.findAll(user, pag, cargo, incluirDeletados);
  }

  @Get('me')
  me(@UsuarioLogado() user: { id: string; cargo: Cargo }) {
    return this.usuarioService.findById(user, user.id, false);
  }

  @MinRole(Cargo.PROFISSIONAL)
  @Get(':id')
  findById(
    @UsuarioLogado() user: { id: string; cargo: Cargo },
    @Param('id') id: string,
    @Query('incluirDeletados', new DefaultValuePipe(false), ParseBoolPipe) incluirDeletados?: boolean,
  ) {
    return this.usuarioService.findById(user, id, incluirDeletados);
  }

  @MinRole(Cargo.PROFISSIONAL)
  @Get('cpf/:cpf')
  findByCpf(
    @UsuarioLogado() user: { id: string; cargo: Cargo },
    @Param('cpf') cpf: string,
    @Query('incluirDeletados', new DefaultValuePipe(false), ParseBoolPipe) incluirDeletados?: boolean,
  ) {
    return this.usuarioService.findByCpf(user, cpf, incluirDeletados);
  }

  @MinRole(Cargo.PROFISSIONAL)
  @Get('email/:email')
  findByEmail(
    @UsuarioLogado() user: { id: string; cargo: Cargo },
    @Param('email') email: string,
    @Query('incluirDeletados', new DefaultValuePipe(false), ParseBoolPipe) incluirDeletados?: boolean,
  ) {
    return this.usuarioService.findByEmail(user, email, incluirDeletados);
  }

  @MinRole(Cargo.ADMIN)
  @Patch(':id')
  update(
    @UsuarioLogado() user: { id: string; cargo: Cargo },
    @Param('id') id: string,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(user, id, dto);
  }

  @MinRole(Cargo.ADMIN)
  @Delete(':id')
  delete(@UsuarioLogado() user: { id: string; cargo: Cargo }, @Param('id') id: string) {
    return this.usuarioService.delete(user, id);
  }

  @MinRole(Cargo.ADMIN)
  @Patch('recuperar/:id')
  recuperar(@UsuarioLogado() user: { id: string; cargo: Cargo }, @Param('id') id: string) {
    return this.usuarioService.recuperar(user, id);
  }
}
