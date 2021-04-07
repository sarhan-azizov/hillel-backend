import { Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import * as JWT from 'jsonwebtoken';

import { TypeToken } from '../../modules/auth/types';

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

  const decodedToken: TypeToken = JWT.verify(
    cookiesToken.slice(7),
    process.env.JWT_SECRET_KEY,
    function (err, decoded) {
      if (!err) {
        return decoded;
      }
      throw new UnauthorizedException(err);
    },
  );

  return decodedToken;
};

export const removeToken = (response: Response) => {
  response.removeHeader('Authorization');
  response.clearCookie('Authorization');
};
