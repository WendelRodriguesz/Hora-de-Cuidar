import { IsOptional, IsString } from 'class-validator';

export class AtualizarPacienteDto {
  @IsOptional()
  @IsString()
  prontuario?: string;
}
