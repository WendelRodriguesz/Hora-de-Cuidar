import { Test, TestingModule } from '@nestjs/testing';
import { CepService } from '../referencias.cep.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('CepService', () => {
  let service: CepService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CepService,
        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<CepService>(CepService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('deve retornar dados do CEP válido', async () => {
    (httpService.get as jest.Mock).mockReturnValueOnce(
      of({ data: {
        cep: '60455-160',
        logradouro: 'Rua Teste',
        bairro: 'Centro',
        localidade: 'Fortaleza',
        uf: 'CE',
        ibge: '2304400',
      } }),
    );

    const result = await service.buscarPorCep('60455160');
    expect(result.estado).toBe('CE');
    expect(result.municipioIbge).toBe('2304400');
  });

  it('deve lançar erro para CEP inexistente', async () => {
    (httpService.get as jest.Mock).mockReturnValueOnce(of({ data: { erro: true } }));

    await expect(service.buscarPorCep('00000000')).rejects.toThrow(NotFoundException);
  });
});
