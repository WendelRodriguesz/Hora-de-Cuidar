import { IsString, Length } from 'class-validator';
export class SiglaUfDto {
  @IsString()
  @Length(2, 2, { message: 'A sigla deve ter exatamente 2 caracteres.' })
  sigla!: string;
}