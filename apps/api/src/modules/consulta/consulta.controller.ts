import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { CriarConsultaDto } from './dto/criar-consulta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { MinRole } from 'src/common/constants/decorators/min-role.decorator';

@Controller('consultas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsultaController {
  constructor(private readonly service: ConsultaService) {}

  @MinRole('PROFISSIONAL')
  @Post()
  criar(@Body() dto: CriarConsultaDto) {
    return this.service.criar(dto);
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.service.buscar(id);
  }

  @Get('paciente/:pacienteId')
  listarPorPaciente(
    @Param('pacienteId') pacienteId: string,
    @Query('page') page = 1,
    @Query('take') take = 10,
  ) {
    return this.service.listarPorPaciente(pacienteId, Number(page), Number(take));
  }
}
