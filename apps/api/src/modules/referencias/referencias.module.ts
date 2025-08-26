import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReferenciasController } from './referencias.controller';
import { IbgeService } from './referencias.ibge.service';
import { CepService } from './referencias.cep.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000 }),
    CacheModule.register({ ttl: 300 }),
  ],
  controllers: [ReferenciasController],
  providers: [IbgeService, CepService],
})
export class ReferenciasModule {}
