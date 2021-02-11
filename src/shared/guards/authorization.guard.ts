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

import { Request } from 'express';
import { Token } from '../types';

export const getVerifiedToken = (request: Request) => {
  // CSRF protection, Double Submit Cookie
  const cookiesToken = request.cookies.Authorization;
  const headersToken = request.headers.authorization;

  if (!cookiesToken) {
    throw new UnauthorizedException('the JSON web token is missing in cookies');
  }

  if (!headersToken) {
    throw new UnauthorizedException(
      'JSON web token is missing in the Authorization header',
    );
  }

  if (cookiesToken !== headersToken) {
    throw new UnauthorizedException("the cookie and Authorization don't match");
  }

  const decodedToken: Token = JWT.verify(
    cookiesToken.slice(7),
    process.env.JWT_SECRET_KEY,
    function (err, decoded) {
      if (!err) {
        return decoded;
      }
      throw new BadRequestException(err);
    },
  );

  return decodedToken;
};

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
