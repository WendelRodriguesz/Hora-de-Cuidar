import { PacienteService } from '../paciente.service';

const mockPrisma: any = {
  usuario: { findUnique: jest.fn() },
  paciente: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $transaction: (fn: any) => fn(mockPrisma),
};

describe('PacienteService', () => {
  let service: PacienteService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new PacienteService(mockPrisma);
  });

  it('criar: ok quando usuario PACIENTE e ainda sem paciente', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue({ id: 'u1', cargo: 'PACIENTE' });
    mockPrisma.paciente.findUnique.mockResolvedValue(null);
    mockPrisma.paciente.create.mockResolvedValue({ id: 'p1', usuario_id: 'u1' });

    const out = await service.criar({ usuario_id: 'u1' });
    expect(out.id).toBe('p1');
  });
});
