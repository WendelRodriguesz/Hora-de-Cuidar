import { Test, TestingModule } from '@nestjs/testing';
import { ConsultaController } from '../consulta.controller';
import { ConsultaService } from '../consulta.service';

describe('ConsultaController', () => {
  let controller: ConsultaController;

  const serviceMock = {
    criar: jest.fn(),
    buscar: jest.fn(),
    listarPorPaciente: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultaController],
      providers: [{ provide: ConsultaService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ConsultaController>(ConsultaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /consultas → chama service.criar', async () => {
    serviceMock.criar.mockResolvedValue({ id: 'c1' });

    const out = await controller.criar({
      data: '2025-08-01T10:00:00.000Z',
      paciente_id: 'pac1',
      profissional_id: 'prof1',
      observacoes: 'ok',
    } as any);

    expect(serviceMock.criar).toHaveBeenCalled();
    expect(out).toEqual({ id: 'c1' });
  });

  it('GET /consultas/:id → chama service.buscar', async () => {
    serviceMock.buscar.mockResolvedValue({ id: 'c1' });

    const out = await controller.buscar('c1');

    expect(serviceMock.buscar).toHaveBeenCalledWith('c1');
    expect(out.id).toBe('c1');
  });

  it('GET /consultas/paciente/:id → chama service.listarPorPaciente', async () => {
    serviceMock.listarPorPaciente.mockResolvedValue({ items: [], meta: { page: 1, take: 10, total: 0 } });

    const out = await controller.listarPorPaciente('pac1', 1 as any, 10 as any);

    expect(serviceMock.listarPorPaciente).toHaveBeenCalledWith('pac1', 1, 10);
    expect(out.meta.total).toBe(0);
  });
});
