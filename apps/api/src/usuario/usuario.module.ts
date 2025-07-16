import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { USUARIO_SERVICE } from 'src/common/constants';

@Module({
  controllers: [UsuarioController],
  providers: [
    {
      provide: USUARIO_SERVICE,
      useClass: UsuarioService,
    },
  ],
})
export class UsuarioModule {}
