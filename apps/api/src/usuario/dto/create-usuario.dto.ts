import {
  IsEmail,
  IsString,
  IsOptional,
  IsDateString,
  MaxLength,
  IsUUID,
  IsEnum,
  IsNotEmpty,
  MinLength,
  Length,
} from 'class-validator';
import { Cargo as PrismaCargo } from '@prisma/client';
export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
  nome: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  senha: string;

  @IsString()
  @IsOptional()
  @MaxLength(15, { message: 'O telefone deve ter no máximo 15 caracteres.' })
  telefone: string;

  @IsDateString(
    {},
    { message: 'A data de nascimento deve ser uma data válida.' },
  )
  @IsNotEmpty()
  data_nasc: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1, { message: 'O sexo deve ser um único caractere' })
  sexo: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'O CPF deve ter 11 caracteres.' })
  cpf: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PrismaCargo, {
    message: 'O papel deve ser um dos seguintes: ADMIN, PROFISSIONAL, PACIENTE',
  })
  cargo: PrismaCargo;

  @IsUUID()
  @IsOptional()
  endereco_id: string;
}
