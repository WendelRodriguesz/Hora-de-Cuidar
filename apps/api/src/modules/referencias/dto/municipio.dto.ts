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
  IsNumber,
} from 'class-validator';

export class MunicipioDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id : string;

  @IsNumber()
  ibge_id : number;

  @IsString()
  @IsNotEmpty()
  nome     : string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  estado_id     : string;
}
