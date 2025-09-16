import { Test, TestingModule } from '@nestjs/testing';
import { ProfissionalController } from '../profissional.controller';
import { ProfissionalService } from '../profissional.service';

describe('ProfissionalController', () => {
  let controller: ProfissionalController;
  const service = {
    solicitar: jest.fn(),
    listarSolicitacoes: jest.fn(),
    aprovar: jest.fn(),
    recusar: jest.fn(),
    sincronizarProfissionais: jest.fn(), 
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfissionalController],
      providers: [{ provide: ProfissionalService, useValue: service }],
    }).compile();

    controller = module.get<ProfissionalController>(ProfissionalController);
  });

  it('POST /profissionais/solicitar → chama service.solicitar', async () => {
    service.solicitar.mockResolvedValue({ id: 'sol1', status: 'aguardando_aprovacao' });

    const out = await controller.solicitar({
      nome: 'Ana',
      area_atuacao: 'Nutrição',
      email: 'ana@hdc.com',
      telefone: '8599',
      documento_url: 'http://x/y.pdf',
    });

    expect(service.solicitar).toHaveBeenCalled();
    expect(out).toEqual({ id: 'sol1', status: 'aguardando_aprovacao' });
  });

  it('GET /profissionais/solicitacoes → repassa query', async () => {
    service.listarSolicitacoes.mockResolvedValue({ items: [], meta: { page: 1, take: 10, total: 0 } });

    const out = await controller.listarSolicitacoes({ page: 1, take: 10 });

    expect(service.listarSolicitacoes).toHaveBeenCalledWith({ page: 1, take: 10 });
    expect(out.meta.total).toBe(0);
  });

  it('PATCH /profissionais/solicitacoes/:id/aprovar → passa actor', async () => {
    service.aprovar.mockResolvedValue({ usuario: { id: 'u1' }, profissional: { id: 'p1' } });
    const actor = { id: 'adminUserId', cargo: 'ADMIN' as const };

    const out = await controller.aprovar('sol1', {}, actor);

    expect(service.aprovar).toHaveBeenCalledWith('sol1', {}, actor);
    expect(out.profissional.id).toBe('p1');
  });

  it('PATCH /profissionais/solicitacoes/:id/recusar → passa actor', async () => {
    service.recusar.mockResolvedValue({ id: 'sol1', status: 'inativo' });
    const actor = { id: 'adminUserId', cargo: 'ADMIN' as const };

    const out = await controller.recusar('sol1', { motivo: 'docs inválidos' }, actor);

    expect(service.recusar).toHaveBeenCalledWith('sol1', { motivo: 'docs inválidos' }, actor);
    expect(out).toEqual({ id: 'sol1', status: 'inativo' });
  });

  it('POST /profissionais/sincronizar → passa dto e actor para o service', async () => {
  service.sincronizarProfissionais.mockResolvedValue({ totalPendentes: 2, criados: ['p1', 'p2'] });

  const actor = { id: 'adminUserId', cargo: 'ADMIN' as const };
  const out = await controller.sincronizar(
    { area_atuacao_padrao: 'Geral', status: 'ativo' } as any,
    actor,
  );

  expect(service.sincronizarProfissionais).toHaveBeenCalledWith(
    { area_atuacao_padrao: 'Geral', status: 'ativo' },
    actor,
  );
  expect(out).toEqual({ totalPendentes: 2, criados: ['p1', 'p2'] });
});

  describe('ProfissionalController (listar)', () => {
    let controller: ProfissionalController;
    const service = { listar: jest.fn() };

    beforeEach(async () => {
      jest.resetAllMocks();
      const module: TestingModule = await Test.createTestingModule({
        controllers: [ProfissionalController],
        providers: [{ provide: ProfissionalService, useValue: service }],
      }).compile();

      controller = module.get(ProfissionalController);
    });

    it('GET /profissionais → chama service.listar com actor e query', async () => {
      service.listar.mockResolvedValue({ items: [], meta: { page: 1, take: 10, total: 0 } });
      const actor = { id: 'prof-1', cargo: 'PROFISSIONAL' as const };

      const out = await controller.listarProfissionais(actor, { page: 1, take: 10 } as any);

      expect(service.listar).toHaveBeenCalledWith(actor, { page: 1, take: 10 });
      expect(out.meta.total).toBe(0);
    });
  });
});
