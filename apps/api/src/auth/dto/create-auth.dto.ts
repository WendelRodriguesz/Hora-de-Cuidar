import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator"

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  senha: string
}
