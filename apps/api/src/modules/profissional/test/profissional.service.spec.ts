import { ProfissionalService } from '../profissional.service';

type Cargo = 'PACIENTE' | 'PROFISSIONAL' | 'ADMIN';

// mock de transação do Prisma com suporte a tx.usuario.create(...)
const txUsuarioCreate = jest.fn();
const mockPrisma = {
  $transaction: (fn: any) =>
    fn({
      usuario: { create: txUsuarioCreate },
    }),
};

// helper para criar mocks de repos com withTx que retorna o próprio mock
function repoMock<T extends object>(shape: T) {
  const mock = shape as any;
  // garante que withTx exista e retorne o próprio mock
  if (!mock.withTx) {
    mock.withTx = jest.fn().mockImplementation(() => mock);
  } else {
    mock.withTx.mockImplementation(() => mock);
  }
  return mock as jest.Mocked<T>;
}

describe('ProfissionalService (repositories + tx)', () => {
  let service: ProfissionalService;

  const solicitacaoRepo = repoMock({
    withTx: jest.fn(),
    create: jest.fn(),
    findUniqueById: jest.fn(),
    findFirstPendenteByEmail: jest.fn(),
    list: jest.fn(),
    count: jest.fn(),
    updateAprovada: jest.fn(),
    updateRecusada: jest.fn(),
  });

  const adminRepo = repoMock({
    withTx: jest.fn(),
    findByUsuarioId: jest.fn(),
    findFirst: jest.fn(),
  });

  const usuarioRepo = repoMock({
    withTx: jest.fn(),
    findUnique: jest.fn(), // service usa findUnique(where, { includePassword? })
    listProfissionaisPendentes: jest.fn(), 
  });

  const profissionalRepo = repoMock({
    withTx: jest.fn(),
    create: jest.fn(),
  });

  beforeEach(() => {
    jest.resetAllMocks();
    txUsuarioCreate.mockReset();

    // reconfigura withTx para sempre retornar o próprio mock
    solicitacaoRepo.withTx.mockImplementation(() => solicitacaoRepo);
    adminRepo.withTx.mockImplementation(() => adminRepo);
    usuarioRepo.withTx.mockImplementation(() => usuarioRepo);
    profissionalRepo.withTx.mockImplementation(() => profissionalRepo);

    service = new ProfissionalService(
      mockPrisma as any,
      solicitacaoRepo as any,
      adminRepo as any,
      usuarioRepo as any,
      profissionalRepo as any,
    );
  });

  it('solicitar: cria quando não há pendente nem usuário', async () => {
    usuarioRepo.findUnique.mockResolvedValue(null); // e-mail não usado
    solicitacaoRepo.findFirstPendenteByEmail.mockResolvedValue(null);
    solicitacaoRepo.create.mockResolvedValue({
      id: 'sol1',
      status: 'aguardando_aprovacao',
      created_at: new Date(),
    });

    const res = await service.solicitar({
      nome: 'Ana',
      area_atuacao: 'Nutrição',
      email: 'ana@hdc.com',
      telefone: '8599',
      documento_url: 'http://x/y.pdf',
    });

    expect(usuarioRepo.findUnique).toHaveBeenCalledWith(
      { email: 'ana@hdc.com' },
      { includePassword: false },
    );
    expect(solicitacaoRepo.create).toHaveBeenCalled();
    expect(res.id).toBe('sol1');
    expect(res.status).toBe('aguardando_aprovacao');
  });

  it('aprovar: pendente → cria usuário (tx), profissional e atualiza solicitação', async () => {
    const actor: { id: string; cargo: Cargo } = { id: 'adminUserId', cargo: 'ADMIN' };

    solicitacaoRepo.findUniqueById.mockResolvedValue({
      id: 'sol1',
      status: 'aguardando_aprovacao',
      nome: 'Ana',
      email: 'ana@hdc.com',
      telefone: '8599',
      area_atuacao: 'Nutrição',
    });
    usuarioRepo.findUnique.mockResolvedValue(null); // e-mail ainda livre
    adminRepo.findByUsuarioId.mockResolvedValue({ id: 'adm1' });

    txUsuarioCreate.mockResolvedValue({
      id: 'u1',
      nome: 'Ana',
      email: 'ana@hdc.com',
      cargo: 'PROFISSIONAL',
    });

    profissionalRepo.create.mockResolvedValue({
      id: 'p1',
      codigo: 'P123',
      status: 'ativo',
    });

    solicitacaoRepo.updateAprovada.mockResolvedValue(undefined);

    const out = await service.aprovar('sol1', {}, actor);

    expect(usuarioRepo.findUnique).toHaveBeenCalledWith(
      { email: 'ana@hdc.com' },
      { includePassword: false },
    );
    expect(adminRepo.findByUsuarioId).toHaveBeenCalledWith('adminUserId');
    expect(txUsuarioCreate).toHaveBeenCalled(); // criou usuário via tx
    expect(profissionalRepo.create).toHaveBeenCalledWith({
      usuario_id: 'u1',
      area_atuacao: 'Nutrição',
      status: 'ativo',
      codigo: expect.any(String),
    });
    expect(solicitacaoRepo.updateAprovada).toHaveBeenCalledWith({
      solicitacaoId: 'sol1',
      administradorId: 'adm1',
      usuarioId: 'u1',
    });

    expect(out.usuario.id).toBe('u1');
    expect(out.profissional.id).toBe('p1');
  });

  it('recusar: muda para inativo e grava administrador', async () => {
    const actor: { id: string; cargo: Cargo } = { id: 'adminUserId', cargo: 'ADMIN' };

    solicitacaoRepo.findUniqueById.mockResolvedValue({
      id: 'sol1',
      status: 'aguardando_aprovacao',
      nome: 'Ana',
      email: 'ana@hdc.com',
      telefone: '8599',
      area_atuacao: 'Nutrição',
    });
    adminRepo.findByUsuarioId.mockResolvedValue({ id: 'adm1' });
    solicitacaoRepo.updateRecusada.mockResolvedValue(undefined);

    const out = await service.recusar('sol1', { motivo: 'docs inválidos' }, actor);

    expect(adminRepo.findByUsuarioId).toHaveBeenCalledWith('adminUserId');
    expect(solicitacaoRepo.updateRecusada).toHaveBeenCalledWith({
      solicitacaoId: 'sol1',
      administradorId: 'adm1',
      motivo: 'docs inválidos',
    });
    expect(out).toEqual({ id: 'sol1', status: 'inativo' });
  });

  it('aprovar: rejeita se actor não é ADMIN', async () => {
    await expect(
      service.aprovar('sol1', {}, { id: 'x', cargo: 'PROFISSIONAL' }),
    ).rejects.toThrow('Apenas administradores podem aprovar.');
  });
  describe('sincronizarProfissionais', () => {
    const actorAdmin = { id: 'admin-1', cargo: 'ADMIN' as const };
  
    it('bloqueia se actor não é ADMIN', async () => {
      await expect(
        service.sincronizarProfissionais({}, { id: 'x', cargo: 'PROFISSIONAL' as const }),
      ).rejects.toThrow('Apenas administradores podem sincronizar profissionais.');
    });
  
    it('retorna vazio quando não há pendentes', async () => {
      usuarioRepo.listProfissionaisPendentes.mockResolvedValueOnce([]);
      const out = await service.sincronizarProfissionais({}, actorAdmin);
      expect(out).toEqual({ totalPendentes: 0, criados: [] });
    });
  
    it('cria profissionais para usuários pendentes com defaults', async () => {
      usuarioRepo.listProfissionaisPendentes.mockResolvedValueOnce([{ id: 'u1' }, { id: 'u2' }]);
      profissionalRepo.create
        .mockResolvedValueOnce({ id: 'p1', codigo: 'P...', status: 'ativo' })
        .mockResolvedValueOnce({ id: 'p2', codigo: 'P...', status: 'ativo' });
  
      const out = await service.sincronizarProfissionais({}, actorAdmin);
  
      expect(profissionalRepo.create).toHaveBeenCalledTimes(2);
      expect(out.totalPendentes).toBe(2);
      expect(out.criados).toEqual(['p1', 'p2']);
    });
  
    it('usa status e área padrão do DTO quando informados', async () => {
      usuarioRepo.listProfissionaisPendentes.mockResolvedValueOnce([{ id: 'u1' }]);
      profissionalRepo.create.mockResolvedValueOnce({ id: 'p1', codigo: 'P...', status: 'inativo' });
  
      await service.sincronizarProfissionais(
        { status: 'inativo', area_atuacao_padrao: 'Esportiva' },
        actorAdmin,
      );
  
      expect(profissionalRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          usuario_id: 'u1',
          area_atuacao: 'Esportiva',
          status: 'inativo',
          codigo: expect.any(String),
        }),
      );
    });
  });
});

