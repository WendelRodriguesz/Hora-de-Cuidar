import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  UseGuards,
  DefaultValuePipe,
  ParseBoolPipe,
  Req,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { USUARIO_SERVICE } from 'src/common/constants/constants';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Cargo } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { UsuarioLogado } from 'src/common/constants/decorators/usuarioLogado.decorator';
import { MinRole } from 'src/common/constants/decorators/min-role.decorator';
import { Min } from 'class-validator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuario')
export class UsuarioController {
  constructor(
    @Inject(USUARIO_SERVICE) private readonly usuarioService: UsuarioService,
  ) {}

  @Get('me')
  async me(@UsuarioLogado() user: { id: string }) {
    return this.usuarioService.findById(user.id, false);
  }

  @MinRole(Cargo.ADMIN)
  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.create(dto);
  }

  @MinRole(Cargo.PROFISSIONAL)
  @Get()
  findAll(
    @Query() pag: PaginacaoDto,
    @Query('cargo') cargo?: Cargo,
    @Query('incluirDeletados', new DefaultValuePipe(false), ParseBoolPipe)
    incluirDeletados?: boolean,
  ) {
    return this.usuarioService.findAll(pag, cargo, incluirDeletados);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @Query('incluirDeletados', new DefaultValuePipe(false), ParseBoolPipe)
    incluirDeletados?: boolean,
  ) {
    return this.usuarioService.findById(id, incluirDeletados);
  }

  @Get('cpf/:cpf')
  findByCpf(
    @Param('cpf') cpf: string,
    @Query('incluirDeletados', new DefaultValuePipe(false), ParseBoolPipe)
    incluirDeletados?: boolean,
  ) {
    return this.usuarioService.findByCpf(cpf, incluirDeletados);
  }

  @Get('email/:email')
  findByEmail(
    @Param('email') email: string,
    @Query('incluirDeletados', new DefaultValuePipe(false), ParseBoolPipe)
    incluirDeletados?: boolean,
  ) {
    return this.usuarioService.findByEmail(email, incluirDeletados);
  }

  @MinRole(Cargo.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, dto);
  }

  @MinRole(Cargo.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usuarioService.delete(id);
  }

  @MinRole(Cargo.ADMIN)
  @Patch('recuperar/:id')
  recuperar(@Param('id') id: string) {
    return this.usuarioService.recuperar(id);
  }
}
