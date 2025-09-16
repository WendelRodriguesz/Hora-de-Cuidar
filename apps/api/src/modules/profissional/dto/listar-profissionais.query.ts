import { IsInt, IsOptional, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ListarProfissionaisQuery {
  @IsOptional() @Type(() => Number) @IsInt()
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt()
  take?: number = 10;

  @IsOptional() @IsIn(['ativo','inativo','aguardando_aprovacao'])
  status?: 'ativo'|'inativo'|'aguardando_aprovacao';

  @IsOptional() @IsString()
  area_atuacao?: string;
}
