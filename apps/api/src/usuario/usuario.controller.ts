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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
  findAll(@Query() pag: PaginacaoDto, @Query('cargo') cargo?: Cargo, @Query('incluirDeletados') incluirDeletados?: boolean) {
    return this.usuarioService.findAll(pag, cargo, incluirDeletados);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Query('incluirDeletados') incluirDeletados?: boolean) {
    return this.usuarioService.findById(id, incluirDeletados);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto, @Query('incluirDeletados') incluirDeletados?: boolean) {
    return this.usuarioService.update(id, updateUsuarioDto, incluirDeletados);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usuarioService.delete(id);
  }

  @Get('cpf/:cpf')
  findByCpf(@Param('cpf') cpf: string, @Query('incluirDeletados') incluirDeletados?: boolean) {
    return this.usuarioService.findByCpf(cpf, incluirDeletados);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string, @Query('incluirDeletados') incluirDeletados?: boolean) {
    return this.usuarioService.findByEmail(email, incluirDeletados);
  }
}
