import { Global, Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { DatabaseModule } from './shared/database.module';

@Global()
@Module({
  imports: [UsuarioModule, DatabaseModule],
  controllers: [],
  providers: [
    // {
    //   provide: 'APP_GUARD',
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
