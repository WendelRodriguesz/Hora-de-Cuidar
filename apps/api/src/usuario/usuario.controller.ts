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
  findAll(@Query() pag: PaginacaoDto, @Query('cargo') cargo?: Cargo) {
    return this.usuarioService.findAll(pag, cargo);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usuarioService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usuarioService.delete(id);
  }
  @Get('cpf/:cpf')
  findByCpf(@Param('cpf') cpf: string) {
    return this.usuarioService.findByCpf(cpf);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usuarioService.findByEmail(email);
  }
}
