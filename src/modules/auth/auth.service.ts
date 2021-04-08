import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as JWT from 'jsonwebtoken';

import { AuthRequestDTO, RegistrationRequestDTO } from './dto';

import { UserService, TypeGetUser } from '../users';
import { TypeToken, TypeParsedToken } from './types';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async authorize(authRequestDTO: AuthRequestDTO): Promise<TypeToken> {
    const authorizedUser = await this.userService.getUser(authRequestDTO, {
      withPassword: true,
    });

    const matchedPassword = await bcrypt.compare(
      authRequestDTO.password,
      authorizedUser.password,
    );

    if (!matchedPassword) {
      throw new UnauthorizedException('The user password is wrong.');
    }

    if (!authorizedUser.activated) {
      throw new ForbiddenException(
        `The user ${authRequestDTO.username} hasn't activated yet`,
      );
    }

    const tokenPayload: TypeParsedToken = {
      username: authorizedUser.username,
      role: authorizedUser.role,
    };

    const token = JWT.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return { token };
  }

  public async registration(
    registrationRequestDTO: RegistrationRequestDTO,
  ): Promise<TypeGetUser> {
    return await this.userService.createUser(registrationRequestDTO);
  }
}
