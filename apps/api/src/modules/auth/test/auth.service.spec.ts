import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { USUARIO_REPOSITORY } from 'src/common/constants/constants';
import { IUsuarioRepository } from 'src/shared/database/repositories/interface/usuario-repository.interface';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let repo: jest.Mocked<IUsuarioRepository>;
  let jwt: JwtService;

  beforeEach(async () => {
    repo = {
      findUnique: jest.fn(),
      recuperar: jest.fn(),
    } as unknown as jest.Mocked<IUsuarioRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USUARIO_REPOSITORY, useValue: repo },
        JwtService,
      ],
    }).compile();

    service = module.get(AuthService);
    jwt = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
