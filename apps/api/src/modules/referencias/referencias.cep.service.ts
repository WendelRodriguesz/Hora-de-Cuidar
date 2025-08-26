import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CepService {
  constructor(private readonly http: HttpService) {}

  async buscarPorCep(cep: string) {
    const { data } = await lastValueFrom(
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`),
    );
    if (data.erro) throw new NotFoundException('CEP não encontrado');
    return {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      municipioIbge: data.ibge,
    };
  }
}
