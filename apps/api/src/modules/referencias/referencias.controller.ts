import { Controller, Get, Param } from '@nestjs/common';
import { IbgeService } from './referencias.ibge.service';
import { CepService } from './referencias.cep.service';
import { SiglaUfDto } from './dto/sigla-uf.dto';

@Controller('referencias')
export class ReferenciasController {
  constructor(
    private readonly ibge: IbgeService,
    private readonly cep: CepService,
  ) {}

  @Get('estados')
  listarEstados() {
    return this.ibge.buscarEstados();
  }

  @Get('estados/:sigla/municipios')
  listarMunicipios(@Param() { sigla }: SiglaUfDto) {
    return this.ibge.buscarCidadesPorEstado(sigla.toUpperCase());
  }

  @Get('cep/:cep')
  buscarCep(@Param('cep') cep: string) {
    return this.cep.buscarPorCep(cep);
  }
}
