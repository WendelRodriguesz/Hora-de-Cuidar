export const usuarioSelect = {
  id: true,
  nome: true,
  email: true,
  telefone: true,
  data_nasc: true,
  sexo: true,
  cpf: true,
  cargo: true,
  endereco_id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
} as const;

export const usuarioComSenhaSelect = {
  ...usuarioSelect,
  senha: true,
} as const;
