import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class IbgeService {
  constructor(private readonly http: HttpService) {}

  async buscarEstados() {
    const { data } = await lastValueFrom(
      this.http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados'),
    );
    return data
      .map((e) => ({ id: e.id, nome: e.nome, sigla: e.sigla }))
      .sort((a, b) => a.sigla.localeCompare(b.sigla));
  }

  async buscarCidadesPorEstado(sigla: string) {
    const { data } = await lastValueFrom(
      this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`),
    );
    return data
      .map((m) => ({ id: m.id, nome: m.nome }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }
}
