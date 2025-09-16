import { IsOptional, IsString, IsEnum } from 'class-validator';

export class SincronizarProfissionaisDto {
  @IsOptional()
  @IsString()
  area_atuacao_padrao?: string = 'Geral';

  @IsOptional()
  @IsEnum(['ativo', 'inativo', 'aguardando_aprovacao'])
  status?: 'ativo' | 'inativo' | 'aguardando_aprovacao' = 'ativo';
}
