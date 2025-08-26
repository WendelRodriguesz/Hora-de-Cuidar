import { Cargo, Usuario } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';

export const UsuarioMock = (): Usuario => ({
  id: faker.string.uuid(),
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  senha: faker.internet.password(),
  telefone: null,
  data_nasc: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
  sexo: faker.person.sex(),
  cpf: faker.string.numeric({ length: 11 }),
  cargo: faker.helpers.enumValue(Cargo),
  endereco_id: null,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
});
