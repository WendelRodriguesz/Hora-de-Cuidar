import { IsOptional, IsString, MinLength } from 'class-validator';

export class RecusarSolicitacaoDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  motivo?: string;
}
