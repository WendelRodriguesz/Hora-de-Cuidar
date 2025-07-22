import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../usuario.service';
import { USUARIO_REPOSITORY } from 'src/common/constants';
import { IUsuarioRepository } from 'src/shared/database/repositories/interface/usuario-repository.interface';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { UsuarioMock } from 'test/shared/types';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UsuarioService', () => {
  let usuarioRepository: jest.Mocked<IUsuarioRepository>;
  let usuarioService: UsuarioService;

  beforeAll(async () => {
    usuarioRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCpf: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IUsuarioRepository>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: USUARIO_REPOSITORY, useValue: usuarioRepository },
      ],
    }).compile();

    usuarioService = module.get<UsuarioService>(UsuarioService);
  });

  it('deve ser definido', () => {
    expect(usuarioService).toBeDefined();
  });

  describe('create', () => {
    it('deve criar usuário com senha hasheada', async () => {
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
      usuarioRepository.create.mockResolvedValueOnce({ ...mock });

      const result = await usuarioService.create(dto);

      expect(usuarioRepository.create).toHaveBeenCalled();
      expect(typeof (result as any).senha).toBe('string');
    });

    it('deve propagar erro se create falhar', async () => {
      const dto = {} as CreateUsuarioDto;
      usuarioRepository.create.mockRejectedValueOnce(new Error());

      await expect(usuarioService.create(dto)).rejects.toThrowError();
    });
  });

  describe('findById, findByCpf, findByEmail', () => {
    const mock = UsuarioMock();

    it('deve retornar por ID', async () => {
      usuarioRepository.findById.mockResolvedValueOnce(mock);
      expect(await usuarioService.findById(mock.id)).toEqual(mock);
    });

    it('deve lançar NotFoundException se ID não existir', async () => {
      usuarioRepository.findById.mockResolvedValueOnce(null);
      await expect(usuarioService.findById('id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('deve retornar por CPF', async () => {
      usuarioRepository.findByCpf.mockResolvedValueOnce(mock);
      expect(await usuarioService.findByCpf(mock.cpf)).toEqual(mock);
    });

    it('deve lançar NotFoundException se CPF não existir', async () => {
      usuarioRepository.findByCpf.mockResolvedValueOnce(null);
      await expect(usuarioService.findByCpf('cpf')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('deve retornar por EMAIL', async () => {
      usuarioRepository.findByEmail.mockResolvedValueOnce(mock);
      expect(await usuarioService.findByEmail(mock.email)).toEqual(mock);
    });

    it('deve lançar NotFoundException se EMAIL não existir', async () => {
      usuarioRepository.findByEmail.mockResolvedValueOnce(null);
      await expect(usuarioService.findByEmail('email')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const mock = UsuarioMock();
    const dto: UpdateUsuarioDto = { nome: 'Novo', cargo: mock.cargo };

    it('deve atualizar usuário existente', async () => {
      usuarioRepository.findById.mockResolvedValueOnce(mock);
      usuarioRepository.update.mockResolvedValueOnce({ ...mock, nome: dto.nome });

      const result = await usuarioService.update(mock.id, dto);
      expect(result.nome).toBe(dto.nome);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      usuarioRepository.findById.mockResolvedValueOnce(null);
      await expect(usuarioService.update('id', dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('deve propagar erro em update', async () => {
      usuarioRepository.findById.mockResolvedValueOnce(mock);
      usuarioRepository.update.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(usuarioService.update(mock.id, dto)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('deve deletar com retorno do repositório', async () => {
      const mock = UsuarioMock();
      usuarioRepository.delete.mockResolvedValueOnce(mock as any);
      const result = await usuarioService.delete(mock.id);
      expect(result).toEqual(mock);
    });

    it('deve propagar erro se delete falhar', async () => {
      usuarioRepository.delete.mockRejectedValueOnce(new NotFoundException());
      await expect(usuarioService.delete('id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('deve listar usuários com paginação', async () => {
      const pag: PaginacaoDto = { skip: 0, limit: 2, page: 1 };
      const mocks = [UsuarioMock(), UsuarioMock()];
      usuarioRepository.findAll.mockResolvedValueOnce({ items: mocks, total: 2 });

      const result = await usuarioService.findAll(pag, undefined, false);

      expect(result.items).toEqual(mocks);
      expect(result.total).toBe(2);
      expect(usuarioRepository.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 2,
        cargo: undefined,
      }, false);
    });
  });
});
