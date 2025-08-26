import { Global, Module } from '@nestjs/common';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { DatabaseModule } from './shared/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ReferenciasModule } from './modules/referencias/referencias.module';

@Global()
@Module({
  imports: [UsuarioModule, DatabaseModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), ReferenciasModule,],
  controllers: [],
  providers: [
    // {
    //   provide: 'APP_GUARD',
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
