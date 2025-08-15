import { Cargo } from '@prisma/client';

export const ROLE_RANK: Record<Cargo, number> = {
  PACIENTE: 1,
  PROFISSIONAL: 2,
  ADMIN: 3,
};
