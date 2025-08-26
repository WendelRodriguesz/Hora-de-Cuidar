import { Test, TestingModule } from '@nestjs/testing';
import { IbgeService } from '../referencias.ibge.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('IbgeService', () => {
  let service: IbgeService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IbgeService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<IbgeService>(IbgeService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('deve listar estados mapeados e ordenados por sigla', async () => {
    (httpService.get as jest.Mock).mockReturnValueOnce(
      of({ data: [
        { id: 1, sigla: 'CE', nome: 'Ceará' },
        { id: 2, sigla: 'SP', nome: 'São Paulo' },
      ] }),
    );

    const result = await service.buscarEstados();
    expect(result).toEqual([
      { id: 1, sigla: 'CE', nome: 'Ceará' },
      { id: 2, sigla: 'SP', nome: 'São Paulo' },
    ]);
  });

  it('deve listar municípios mapeados e ordenados por nome', async () => {
    (httpService.get as jest.Mock).mockReturnValueOnce(
      of({ data: [
        { id: 100, nome: 'Fortaleza' },
        { id: 101, nome: 'Caucaia' },
      ] }),
    );

    const result = await service.buscarCidadesPorEstado('CE');
    expect(result.map((m) => m.nome)).toContain('Fortaleza');
  });
});
