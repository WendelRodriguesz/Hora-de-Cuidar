import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AprovarSolicitacaoDto {
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @MaxLength(30)
  senha?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  codigo?: string;
}
