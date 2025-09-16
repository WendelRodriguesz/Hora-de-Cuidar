import { Test, TestingModule } from '@nestjs/testing';
import { PacienteController } from '../paciente.controller';
import { PacienteService } from '../paciente.service';

describe('PacienteController', () => {
  let controller: PacienteController;

  const serviceMock = {
    criar: jest.fn(),
    buscar: jest.fn(),
    atualizar: jest.fn(),
    listar: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PacienteController],
      providers: [
        { provide: PacienteService, useValue: serviceMock }, // 👈 mocka o service
      ],
    }).compile();

    controller = module.get<PacienteController>(PacienteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /pacientes → chama service.criar', async () => {
    serviceMock.criar.mockResolvedValue({ id: 'p1', usuario_id: 'u1' });

    const out = await controller.criar({ usuario_id: 'u1', prontuario: 'texto' } as any);

    expect(serviceMock.criar).toHaveBeenCalledWith({ usuario_id: 'u1', prontuario: 'texto' });
    expect(out).toEqual({ id: 'p1', usuario_id: 'u1' });
  });

  it('GET /pacientes/:id → chama service.buscar', async () => {
    serviceMock.buscar.mockResolvedValue({ id: 'p1' });

    const out = await controller.buscar('p1');

    expect(serviceMock.buscar).toHaveBeenCalledWith('p1');
    expect(out).toEqual({ id: 'p1' });
  });

  it('PATCH /pacientes/:id → chama service.atualizar', async () => {
    serviceMock.atualizar.mockResolvedValue({ id: 'p1', prontuario: 'novo' });

    const out = await controller.atualizar('p1', { prontuario: 'novo' } as any);

    expect(serviceMock.atualizar).toHaveBeenCalledWith('p1', { prontuario: 'novo' });
    expect(out).toEqual({ id: 'p1', prontuario: 'novo' });
  });

  it('GET /pacientes → chama service.listar', async () => {
    serviceMock.listar.mockResolvedValue({ items: [], meta: { page: 1, take: 10, total: 0 } });

    const out = await controller.listar(1 as any, 10 as any);

    expect(serviceMock.listar).toHaveBeenCalledWith(1, 10);
    expect(out).toEqual({ items: [], meta: { page: 1, take: 10, total: 0 } });
  });
});