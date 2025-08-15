import { SetMetadata } from '@nestjs/common';
import { Cargo } from '@prisma/client';

export const MIN_ROLE_KEY = 'min_role';

export const MinRole = (role: Cargo) => SetMetadata(MIN_ROLE_KEY, role);