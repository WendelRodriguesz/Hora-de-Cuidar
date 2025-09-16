import { IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';

export class CriarConsultaDto {
  @IsDateString()
  data: string; // ISO

  @IsUUID()
  paciente_id: string;

  @IsUUID()
  profissional_id: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
