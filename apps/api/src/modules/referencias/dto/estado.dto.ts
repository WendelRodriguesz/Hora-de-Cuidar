import {
  IsEmail,
  IsString,
  IsUUID,
  IsNotEmpty,
  Length,
  IsNumber,
} from 'class-validator';

export class EstadoDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id : string;

  @IsNumber()
  ibge_uf_id : number;

  @IsString()
  @IsNotEmpty()
  nome     : string;

  @IsString()
  @Length(2, 2, { message: 'A sigla deve ter exatamente 2 caracteres.' })
  @IsNotEmpty()
  sigla     : string;
}
