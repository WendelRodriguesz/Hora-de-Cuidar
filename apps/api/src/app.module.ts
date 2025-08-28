import { Global, Module } from '@nestjs/common';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { DatabaseModule } from './shared/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ReferenciasModule } from './modules/referencias/referencias.module';
import { ProfissionalModule } from './modules/profissional/profissional.module';
import { ConsultaModule } from './modules/consulta/consulta.module';
import { PacienteModule } from './modules/paciente/paciente.module';
import { PlanoAlimentarModule } from './modules/plano-alimentar/plano-alimentar.module';

@Global()
@Module({
  imports: [UsuarioModule, DatabaseModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), ReferenciasModule, ProfissionalModule, ConsultaModule, PacienteModule, PlanoAlimentarModule ],
  controllers: [],
  providers: [
    // {
    //   provide: 'APP_GUARD',
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
