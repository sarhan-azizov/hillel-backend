import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as JWT from 'jsonwebtoken';
import { UserRoles } from '../modules/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('JSON web token is missing');
    }

    const decodedToken = JWT.verify(
      request.headers.authorization.slice(7),
      process.env.JWT_SECRET_KEY,
      function (err, decoded) {
        if (!err) {
          return decoded;
        }
        throw new BadRequestException(err);
      },
    );

    if (decodedToken.role && decodedToken.role === UserRoles.ADMIN) {
      return true;
    }

    throw new ForbiddenException(
      "Your user doesn't have appropriate permission",
    );
  }
}
