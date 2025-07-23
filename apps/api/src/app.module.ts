import { Global, Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { DatabaseModule } from './shared/database.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from '@nestjs/passport';

@Global()
@Module({
  imports: [UsuarioModule, DatabaseModule, AuthModule],
  controllers: [],
  providers: [
    // {
    //   provide: 'APP_GUARD',
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
