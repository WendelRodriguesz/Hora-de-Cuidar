import {
  CanActivate, ExecutionContext, Injectable, ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cargo } from '@prisma/client';
import { MIN_ROLE_KEY } from 'src/common/constants/decorators/min-role.decorator'
import { ROLE_RANK } from 'src/common/constants/roles.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    // lê o mínimo papel exigido do handler ou do controller
    const requiredMinRole = this.reflector.getAllAndOverride<Cargo>(
      MIN_ROLE_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredMinRole) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as { cargo?: Cargo };

    if (!user?.cargo) {
      throw new ForbiddenException('Usuário com cargo indefinido');
    }

    const userRank = ROLE_RANK[user.cargo];
    const minRank = ROLE_RANK[requiredMinRole];

    if (userRank >= minRank) return true;

    throw new ForbiddenException('O usuário não tem permissão para acessar este recurso');
  }
}
