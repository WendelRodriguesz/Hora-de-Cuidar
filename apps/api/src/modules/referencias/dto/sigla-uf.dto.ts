import { IsString, Length, Matches } from 'class-validator';
export class SiglaUfDto {
  @IsString()
  @Length(2, 2, { message: 'A sigla deve ter exatamente 2 caracteres.' })
  @Matches(/^[A-Za-z]{2}$/, { message: 'Use apenas letras (UF).' })
  sigla!: string;
}