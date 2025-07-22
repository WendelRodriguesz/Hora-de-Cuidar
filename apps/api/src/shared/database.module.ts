import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsuarioRepository } from './database/repositories/usuario.repository';
import { USUARIO_REPOSITORY } from 'src/common/constants';
@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: USUARIO_REPOSITORY,
      useClass: UsuarioRepository,
    },
  ],
  exports: [PrismaService, USUARIO_REPOSITORY],
})
export class DatabaseModule {}
