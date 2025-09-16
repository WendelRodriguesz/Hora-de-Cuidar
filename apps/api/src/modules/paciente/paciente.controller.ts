import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { CriarPacienteDto } from './dto/criar-paciente.dto';
import { AtualizarPacienteDto } from './dto/atualizar-paciente.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { MinRole } from 'src/common/constants/decorators/min-role.decorator';

@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PacienteController {
  constructor(private readonly service: PacienteService) {}

  @MinRole('PROFISSIONAL')
  @Post()
  criar(@Body() dto: CriarPacienteDto) {
    return this.service.criar(dto);
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.service.buscar(id);
  }

  @MinRole('PROFISSIONAL')
  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarPacienteDto) {
    return this.service.atualizar(id, dto);
  }

  @Get()
  listar(@Query('page') page = 1, @Query('take') take = 10) {
    return this.service.listar(Number(page), Number(take));
  }
}
