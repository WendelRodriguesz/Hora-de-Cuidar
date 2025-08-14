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
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { USUARIO_SERVICE } from 'src/common/constants';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Cargo } from '@prisma/client';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('usuario')
export class UsuarioController {
  constructor(
    @Inject(USUARIO_SERVICE) private readonly usuarioService: UsuarioService,
  ) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll(
    @Query() pag: PaginacaoDto,
    @Query('cargo') cargo?: Cargo,
    @Query('incluirDeletados') incluirDeletados?: boolean,
  ) {
    return this.usuarioService.findAll(pag, cargo, incluirDeletados);
  }

  @Get(':tipo/:param')
  findBy(
    @Param('tipo') tipo: string,
    @Param('param') param: string,
    @Query('incluirDeletados') incluirDeletados?: boolean,
  ) {
    return this.usuarioService.findBy(tipo, param, incluirDeletados);
  }
  @Patch('recuperar/:id')
  recuperar(@Param('id') id: string) {
    return this.usuarioService.recuperar(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Query('incluirDeletados') incluirDeletados?: boolean,
  ) {
    return this.usuarioService.update(id, updateUsuarioDto, incluirDeletados);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usuarioService.delete(id);
  }

}
