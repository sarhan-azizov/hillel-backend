import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { getVerifiedToken } from '../helpers';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const decodedToken = getVerifiedToken(request);

    if (decodedToken.role && roles.includes(decodedToken.role)) {
      return true;
    }

    throw new ForbiddenException(
      "Your user doesn't have appropriate permission",
    );
  }
}
