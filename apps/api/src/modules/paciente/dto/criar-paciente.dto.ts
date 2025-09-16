import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CriarPacienteDto {
  @IsUUID()
  usuario_id: string; // no MVP, exigimos usuário já existente com cargo PACIENTE

  @IsOptional()
  @IsString()
  prontuario?: string;
}
