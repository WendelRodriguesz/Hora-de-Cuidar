import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../usuario.service';
import { USUARIO_REPOSITORY } from 'src/common/constants/constants';
import { IUsuarioRepository } from 'src/shared/database/repositories/interface/usuario-repository.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { UsuarioMock } from 'test/shared/types';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cargo } from '@prisma/client';

const actor = (id: string, cargo: Cargo) => ({ id, cargo });

describe('UsuarioService', () => {
  let repo: jest.Mocked<IUsuarioRepository>;
  let service: UsuarioService;

  const ADMIN = actor('admin-1', 'ADMIN' as Cargo);
  const PROF = actor('prof-1', 'PROFISSIONAL' as Cargo);
  const PROF2 = actor('prof-2', 'PROFISSIONAL' as Cargo);
  const PAC = actor('pac-1', 'PACIENTE' as Cargo);

  beforeAll(async () => {
    repo = {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      recuperar: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IUsuarioRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: USUARIO_REPOSITORY, useValue: repo },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar usuário (senha hasheada enviada ao repo)', async () => {
      const dto: CreateUsuarioDto = {
        nome: 'Test',
        email: 't@test.com',
        senha: 'plain',
        telefone: null,
        data_nasc: '1990-01-01',
        sexo: 'M',
        cpf: '12345678901',
        cargo: 'PACIENTE' as any,
        endereco_id: 'endereco-id',
      };
      const mock = UsuarioMock();
      repo.create.mockResolvedValueOnce({ ...mock });

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalled();
      const args = repo.create.mock.calls[0][0] as any;
      expect(args.senha).not.toEqual('plain');
      expect(result).toEqual(mock);
    });

    it('deve propagar erro se create falhar', async () => {
      repo.create.mockRejectedValueOnce(new Error());
      await expect(service.create({} as any)).rejects.toThrowError();
    });
  });

  describe('findById / findByCpf / findByEmail', () => {
    const base = UsuarioMock();

    it('findById: retorna quando existe e não foi deletado (paciente vendo paciente)', async () => {
      const mock = { ...base, id: 'u1', cargo: Cargo.PACIENTE, deleted_at: null };
      repo.findUnique.mockResolvedValueOnce(mock);

      await expect(service.findById(PAC, mock.id)).resolves.toEqual(mock);
      expect(repo.findUnique).toHaveBeenCalledWith({ id: mock.id });
    });

    it('findById: NotFound quando não existe', async () => {
      repo.findUnique.mockResolvedValueOnce(null);
      await expect(service.findById(PAC, 'id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('findByCpf: BadRequest se deletado e includeDeleted=false', async () => {
      const deleted = { ...base, cpf: '123', deleted_at: new Date() };
      repo.findUnique.mockResolvedValueOnce(deleted);

      await expect(service.findByCpf(PAC, deleted.cpf)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('findByCpf: retorna se deletado com includeDeleted=true', async () => {
      const deleted = { ...base, cpf: '123', deleted_at: new Date() };
      repo.findUnique.mockResolvedValueOnce(deleted);

      await expect(service.findByCpf(PAC, deleted.cpf, true)).resolves.toEqual(
        deleted,
      );
      expect(repo.findUnique).toHaveBeenCalledWith({ cpf: deleted.cpf });
    });

    it('findByEmail: NotFound quando não existe', async () => {
      repo.findUnique.mockResolvedValueOnce(null);
      await expect(service.findByEmail(PAC, 'x@x.com')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('ADMIN não pode ver dados de outro ADMIN', async () => {
      const adminAlvo = {
        ...base,
        id: 'admin-2',
        cargo: Cargo.ADMIN,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(adminAlvo);

      await expect(
        service.findById(ADMIN, adminAlvo.id),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('ADMIN pode ver a si mesmo', async () => {
      const adminSelf = {
        ...base,
        id: ADMIN.id,
        cargo: Cargo.ADMIN,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(adminSelf);

      await expect(service.findById(ADMIN, adminSelf.id)).resolves.toEqual(
        adminSelf,
      );
    });

    it('PROFISSIONAL não pode ver outro PROFISSIONAL', async () => {
      const profTarget = {
        ...base,
        id: 'prof-2',
        cargo: Cargo.PROFISSIONAL,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(profTarget);

      await expect(
        service.findById(PROF, profTarget.id),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('PROFISSIONAL pode ver a si mesmo', async () => {
      const profSelf = {
        ...base,
        id: PROF.id,
        cargo: Cargo.PROFISSIONAL,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(profSelf);

      await expect(service.findById(PROF, profSelf.id)).resolves.toEqual(
        profSelf,
      );
    });

    it('PROFISSIONAL pode ver PACIENTE', async () => {
      const patient = {
        ...base,
        id: 'pac-xyz',
        cargo: Cargo.PACIENTE,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(patient);

      await expect(service.findById(PROF, patient.id)).resolves.toEqual(
        patient,
      );
    });
  });

  describe('update', () => {
    const base = UsuarioMock();
    const dto: UpdateUsuarioDto = { nome: 'Novo', cargo: base.cargo };

    it('atualiza quando existe e não está deletado (prof atualizando a si mesmo)', async () => {
      const profSelf = {
        ...base,
        id: PROF.id,
        cargo: Cargo.PROFISSIONAL,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(profSelf);
      repo.update.mockResolvedValueOnce({ ...profSelf, nome: dto.nome } as any);

      const result = await service.update(PROF, profSelf.id, dto);
      expect(result.nome).toBe(dto.nome);
      expect(repo.update).toHaveBeenCalledWith(profSelf.id, dto);
    });

    it('NotFound quando não existe', async () => {
      repo.findUnique.mockResolvedValueOnce(null);
      await expect(service.update(PAC, 'id', dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('propaga erro de update', async () => {
      const target = {
        ...base,
        id: PAC.id,
        cargo: Cargo.PACIENTE,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(target);
      repo.update.mockRejectedValueOnce(new InternalServerErrorException());

      await expect(service.update(PAC, target.id, dto)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });

    it('BadRequest quando usuário está deletado', async () => {
      const deleted = {
        ...base,
        id: PAC.id,
        cargo: Cargo.PACIENTE,
        deleted_at: new Date(),
      };
      repo.findUnique.mockResolvedValueOnce(deleted);

      await expect(service.update(PAC, deleted.id, dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('Forbidden quando PROF tenta atualizar outro PROF', async () => {
      const otherProf = {
        ...base,
        id: PROF2.id,
        cargo: Cargo.PROFISSIONAL,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(otherProf);

      await expect(
        service.update(PROF, otherProf.id, dto),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('BadRequest se já deletado', async () => {
      const target = {
        ...UsuarioMock(),
        id: PAC.id,
        cargo: Cargo.PACIENTE,
        deleted_at: new Date(),
      };
      repo.findUnique.mockResolvedValueOnce(target);

      await expect(service.delete(PAC, target.id)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('deleta (soft) quando não deletado e visão permite', async () => {
      const target = {
        ...UsuarioMock(),
        id: PAC.id,
        cargo: Cargo.PACIENTE,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(target);
      repo.delete.mockResolvedValueOnce(target as any);

      const result = await service.delete(PAC, target.id);
      expect(result).toEqual(target);
    });

    it('propaga erro se delete falhar', async () => {
      const target = {
        ...UsuarioMock(),
        id: PAC.id,
        cargo: Cargo.PACIENTE,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(target);
      repo.delete.mockRejectedValueOnce(new NotFoundException());

      await expect(service.delete(PAC, target.id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('Forbidden quando PROF tenta deletar outro PROF', async () => {
      const otherProf = {
        ...UsuarioMock(),
        id: 'prof-2',
        cargo: Cargo.PROFISSIONAL,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(otherProf);

      await expect(service.delete(PROF, otherProf.id)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });

  describe('recuperar', () => {
    it('BadRequest se não está deletado', async () => {
      const target = {
        ...UsuarioMock(),
        id: PAC.id,
        cargo: Cargo.PACIENTE,
        deleted_at: null,
      };
      repo.findUnique.mockResolvedValueOnce(target);

      await expect(service.recuperar(PAC, target.id)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('recupera quando está deletado e visão permite', async () => {
      const target = {
        ...UsuarioMock(),
        id: PAC.id,
        cargo: Cargo.PACIENTE,
        deleted_at: new Date(),
      };
      repo.findUnique.mockResolvedValueOnce(target);
      repo.recuperar.mockResolvedValueOnce({
        ...target,
        deleted_at: null,
      } as any);

      const result = await service.recuperar(PAC, target.id);
      expect(result.deleted_at).toBeNull();
    });

    it('Forbidden quando PROF tenta recuperar outro PROF', async () => {
      const otherProf = {
        ...UsuarioMock(),
        id: 'prof-2',
        cargo: Cargo.PROFISSIONAL,
        deleted_at: new Date(),
      };
      repo.findUnique.mockResolvedValueOnce(otherProf);

      await expect(
        service.recuperar(PROF, otherProf.id),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('lista com paginação e aplica filtro de visibilidade para PROFISSIONAL', async () => {
      const pag: PaginacaoDto = { skip: 0, limit: 10, page: 1 };
      const items = [
        { ...UsuarioMock(), id: PROF.id,  cargo: Cargo.PROFISSIONAL, deleted_at: null }, // eu mesmo
        { ...UsuarioMock(), id: 'p1',     cargo: Cargo.PACIENTE,     deleted_at: null }, // paciente visível
        { ...UsuarioMock(), id: 'prof-2', cargo: Cargo.PROFISSIONAL, deleted_at: null }, // outro prof (deve sumir)
        { ...UsuarioMock(), id: 'adm-1',  cargo: Cargo.ADMIN,        deleted_at: null }, // admin (deve sumir p/ PROF)
      ];
      repo.findAll.mockResolvedValueOnce({ items, total: items.length });

      const result = await service.findAll(PROF, pag, undefined, false);

      // deve esconder 'prof-2' e 'adm-1'
      expect(result.items.find(u => u.id === 'prof-2')).toBeUndefined();
      expect(result.items.find(u => u.id === 'adm-1')).toBeUndefined();

      // agora devem sobrar só 2
      expect(result.items.length).toBe(2);
      expect(result.items.some(u => u.id === PROF.id)).toBeTruthy(); // self
      expect(result.items.some(u => u.id === 'p1')).toBeTruthy();    // paciente

      expect(repo.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        cargo: undefined,
        includeDeleted: false,
      });
    });
  });
});