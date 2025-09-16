import { ConsultaService } from '../consulta.service';

const mockPrisma: any = {
  paciente: { findUnique: jest.fn() },
  profissional: { findUnique: jest.fn() },
  consulta: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $transaction: (opsOrFn: any) => {
    // suporta tanto array de ops quanto fn(tx)
    if (Array.isArray(opsOrFn)) {
      return Promise.all(opsOrFn);
    }
    return opsOrFn(mockPrisma);
  },
};

describe('ConsultaService', () => {
  let service: ConsultaService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ConsultaService(mockPrisma);
  });

  it('criar → ok quando paciente existe e profissional ativo', async () => {
    mockPrisma.paciente.findUnique.mockResolvedValue({ id: 'pac1' });
    mockPrisma.profissional.findUnique.mockResolvedValue({ id: 'prof1', status: 'ativo' });
    mockPrisma.consulta.create.mockResolvedValue({ id: 'c1' });

    const out = await service.criar({
      data: '2025-08-01T10:00:00.000Z',
      paciente_id: 'pac1',
      profissional_id: 'prof1',
      observacoes: 'Tudo certo',
    });

    expect(mockPrisma.consulta.create).toHaveBeenCalled();
    expect(out).toEqual({ id: 'c1' });
  });

  it('criar → erro se paciente não existe', async () => {
    mockPrisma.paciente.findUnique.mockResolvedValue(null);
    mockPrisma.profissional.findUnique.mockResolvedValue({ id: 'prof1', status: 'ativo' });

    await expect(service.criar({
      data: '2025-08-01T10:00:00.000Z',
      paciente_id: 'pacX',
      profissional_id: 'prof1',
    })).rejects.toThrow('Paciente não encontrado.');
  });

  it('criar → erro se profissional não existe', async () => {
    mockPrisma.paciente.findUnique.mockResolvedValue({ id: 'pac1' });
    mockPrisma.profissional.findUnique.mockResolvedValue(null);

    await expect(service.criar({
      data: '2025-08-01T10:00:00.000Z',
      paciente_id: 'pac1',
      profissional_id: 'profX',
    })).rejects.toThrow('Profissional não encontrado.');
  });

  it('criar → erro se profissional inativo', async () => {
    mockPrisma.paciente.findUnique.mockResolvedValue({ id: 'pac1' });
    mockPrisma.profissional.findUnique.mockResolvedValue({ id: 'prof1', status: 'inativo' });

    await expect(service.criar({
      data: '2025-08-01T10:00:00.000Z',
      paciente_id: 'pac1',
      profissional_id: 'prof1',
    })).rejects.toThrow('Profissional inativo.');
  });

  it('buscar → ok', async () => {
    mockPrisma.consulta.findUnique.mockResolvedValue({ id: 'c1' });
    const out = await service.buscar('c1');
    expect(out.id).toBe('c1');
  });

  it('buscar → not found', async () => {
    mockPrisma.consulta.findUnique.mockResolvedValue(null);
    await expect(service.buscar('cX')).rejects.toThrow('Consulta não encontrada.');
  });

  it('listarPorPaciente → paginação ok', async () => {
    mockPrisma.consulta.findMany.mockResolvedValue([{ id: 'c1' }]);
    mockPrisma.consulta.count.mockResolvedValue(1);

    const out = await service.listarPorPaciente('pac1', 2, 5);

    expect(mockPrisma.consulta.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { paciente_id: 'pac1' }, skip: 5, take: 5 }),
    );
    expect(out.meta).toEqual({ page: 2, take: 5, total: 1 });
  });
});
