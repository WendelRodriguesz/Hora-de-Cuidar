import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export enum StatusSolicitacao {
  aguardando_aprovacao = 'aguardando_aprovacao',
  ativo = 'ativo',
  inativo = 'inativo',
}

export class ListarSolicitacoesQuery {
  @IsOptional()
  @IsEnum(StatusSolicitacao)
  status?: StatusSolicitacao;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number = 10;
}
