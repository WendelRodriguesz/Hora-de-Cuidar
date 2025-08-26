import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { USUARIO_SERVICE } from 'src/common/constants/constants';

@Module({
  controllers: [UsuarioController],
  providers: [
    {
      provide: USUARIO_SERVICE,
      useClass: UsuarioService,
    },
  ],
  exports: [USUARIO_SERVICE],
})
export class UsuarioModule {}
