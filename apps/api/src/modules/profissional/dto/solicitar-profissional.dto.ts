import { IsEmail, IsString, IsUrl, IsOptional, MinLength } from 'class-validator';

export class SolicitarProfissionalDto {
  @IsString()
  nome: string;

  @IsString()
  area_atuacao: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  telefone: string;

  @IsUrl()
  documento_url: string;
}
