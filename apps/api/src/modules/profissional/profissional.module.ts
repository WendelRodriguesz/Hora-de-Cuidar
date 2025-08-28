import { Module } from '@nestjs/common';
import { ProfissionalController } from './profissional.controller';
import { ProfissionalService } from './profissional.service';
import { PrismaService } from '../../shared/prisma.service';
import { REPO_TOKENS } from '../../shared/database/repositories/tokens';
import { ProfissionalSolicitacaoRepository } from '../../shared/database/repositories/profissional-solicitacao.repository';
import { AdministradorRepository } from '../../shared/database/repositories/administrador.repository';
import { UsuarioRepository } from '../../shared/database/repositories/usuario.repository';
import { ProfissionalRepository } from '../../shared/database/repositories/profissional.repository';

@Module({
  controllers: [ProfissionalController],
  providers: [ProfissionalService, PrismaService,
    { provide: REPO_TOKENS.PROF_SOLIC, useClass: ProfissionalSolicitacaoRepository },
    { provide: REPO_TOKENS.ADMIN,      useClass: AdministradorRepository },
    { provide: REPO_TOKENS.USUARIO,    useClass: UsuarioRepository },
    { provide: REPO_TOKENS.PROF,       useClass: ProfissionalRepository },
  ],
})
export class ProfissionalModule {}
