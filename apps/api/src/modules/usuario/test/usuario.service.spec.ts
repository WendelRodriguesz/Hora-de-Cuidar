import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../usuario.service';
import { USUARIO_REPOSITORY } from 'src/common/constants';
import { IUsuarioRepository } from 'src/shared/database/repositories/interface/usuario-repository.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { UsuarioMock } from 'test/shared/types';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

// Dica: esse mock deve refletir a NOVA interface
describe('UsuarioService', () => {
  let repo: jest.Mocked<IUsuarioRepository>;
  let service: UsuarioService;

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
        cargo: 'PACIENTE',
        endereco_id: 'endereco-id',
      };
      const mock = UsuarioMock();
      repo.create.mockResolvedValueOnce({ ...mock });

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalled();
      // sanity check: senha enviada ao repo != plain
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
    const mock = UsuarioMock();

    it('findById: retorna quando existe e não foi deletado', async () => {
      repo.findUnique.mockResolvedValueOnce(mock);
      await expect(service.findById(mock.id)).resolves.toEqual(mock);
      expect(repo.findUnique).toHaveBeenCalledWith({ id: mock.id });
    });

    it('findById: NotFound quando não existe', async () => {
      repo.findUnique.mockResolvedValueOnce(null);
      await expect(service.findById('id')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('findByCpf: BadRequest se deletado e includeDeleted=false', async () => {
      const deleted = { ...mock, deleted_at: new Date() };
      repo.findUnique.mockResolvedValueOnce(deleted);
      await expect(service.findByCpf(mock.cpf)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('findByCpf: retorna se deletado com includeDeleted=true', async () => {
      const deleted = { ...mock, deleted_at: new Date() };
      repo.findUnique.mockResolvedValueOnce(deleted);
      await expect(service.findByCpf(mock.cpf, true)).resolves.toEqual(deleted);
      expect(repo.findUnique).toHaveBeenCalledWith({ cpf: mock.cpf });
    });

    it('findByEmail: NotFound quando não existe', async () => {
      repo.findUnique.mockResolvedValueOnce(null);
      await expect(service.findByEmail('x@x.com')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    const mock = UsuarioMock();
    const dto: UpdateUsuarioDto = { nome: 'Novo', cargo: mock.cargo };

    it('atualiza quando existe e não está deletado', async () => {
      repo.findUnique.mockResolvedValueOnce({ ...mock, deleted_at: null });
      repo.update.mockResolvedValueOnce({ ...mock, nome: dto.nome } as any);

      const result = await service.update(mock.id, dto);
      expect(result.nome).toBe(dto.nome);
      expect(repo.update).toHaveBeenCalledWith(mock.id, dto);
    });

    it('NotFound quando não existe', async () => {
      repo.findUnique.mockResolvedValueOnce(null);
      await expect(service.update('id', dto)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('propaga erro de update', async () => {
      repo.findUnique.mockResolvedValueOnce(mock);
      repo.update.mockRejectedValueOnce(new InternalServerErrorException());
      await expect(service.update(mock.id, dto)).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('BadRequest quando usuário está deletado', async () => {
      repo.findUnique.mockResolvedValueOnce({ ...mock, deleted_at: new Date() });
      await expect(service.update(mock.id, dto)).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('delete', () => {
    it('BadRequest se já deletado', async () => {
      const mock = UsuarioMock();
      repo.findUnique.mockResolvedValueOnce({ ...mock, deleted_at: new Date() });
      await expect(service.delete(mock.id)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('deleta (soft) quando não deletado', async () => {
      const mock = UsuarioMock();
      repo.findUnique.mockResolvedValueOnce({ ...mock, deleted_at: null });
      repo.delete.mockResolvedValueOnce(mock as any);
      const result = await service.delete(mock.id);
      expect(result).toEqual(mock);
    });

    it('propaga erro se delete falhar', async () => {
      repo.findUnique.mockResolvedValueOnce(UsuarioMock() as any);
      repo.delete.mockRejectedValueOnce(new NotFoundException());
      await expect(service.delete('id')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('recuperar', () => {
    it('BadRequest se não está deletado', async () => {
      const mock = UsuarioMock();
      repo.findUnique.mockResolvedValueOnce({ ...mock, deleted_at: null });
      await expect(service.recuperar(mock.id)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('recupera quando está deletado', async () => {
      const mock = UsuarioMock();
      repo.findUnique.mockResolvedValueOnce({ ...mock, deleted_at: new Date() });
      repo.recuperar.mockResolvedValueOnce({ ...mock, deleted_at: null } as any);
      const result = await service.recuperar(mock.id);
      expect(result.deleted_at).toBeNull();
    });
  });

  describe('findAll', () => {
    it('lista com paginação e includeDeleted=false por padrão', async () => {
      const pag: PaginacaoDto = { skip: 0, limit: 2, page: 1 };
      const mocks = [UsuarioMock(), UsuarioMock()];
      repo.findAll.mockResolvedValueOnce({ items: mocks, total: 2 });

      const result = await service.findAll(pag, undefined, false);

      expect(result.items).toEqual(mocks);
      expect(result.total).toBe(2);
      expect(repo.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 2,
        cargo: undefined,
        includeDeleted: false,
      });
    });
  });
});
