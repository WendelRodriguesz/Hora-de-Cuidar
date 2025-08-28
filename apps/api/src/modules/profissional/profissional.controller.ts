import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProfissionalService } from './profissional.service';
import { SolicitarProfissionalDto } from './dto/solicitar-profissional.dto';
import { AprovarSolicitacaoDto } from './dto/aprovar-solicitacao.dto';
import { RecusarSolicitacaoDto } from './dto/recusar-solicitacao.dto';
import { ListarSolicitacoesQuery } from './dto/listar-solicitacoes.query';
import { UsuarioLogado } from 'src/common/constants/decorators/usuarioLogado.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { MinRole } from 'src/common/constants/decorators/min-role.decorator';

@Controller('profissionais')
export class ProfissionalController {
  constructor(private readonly service: ProfissionalService) {}

  @Post('solicitar')
  solicitar(@Body() dto: SolicitarProfissionalDto) {
    return this.service.solicitar(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRole('ADMIN')
  @Get('solicitacoes')
  listarSolicitacoes(@Query() q: ListarSolicitacoesQuery) {
    return this.service.listarSolicitacoes(q);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRole('ADMIN')
  @Patch('solicitacoes/:id/aprovar')
  aprovar(@Param('id') id: string, @Body() dto: AprovarSolicitacaoDto, @UsuarioLogado() ator: { id: string; cargo: 'ADMIN' | 'PROFISSIONAL' | 'PACIENTE' },) {
    return this.service.aprovar(id, dto, ator);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRole('ADMIN')
  @Patch('solicitacoes/:id/recusar')
  recusar(@Param('id') id: string, @Body() dto: RecusarSolicitacaoDto, @UsuarioLogado() ator: { id: string; cargo: 'ADMIN' | 'PROFISSIONAL' | 'PACIENTE' }) {
    return this.service.recusar(id, dto, ator);
  }
}
