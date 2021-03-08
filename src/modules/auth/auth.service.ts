import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as JWT from 'jsonwebtoken';

import {
  RegistrationRequestDTO,
  RegistrationResponseDTO,
  AuthResponseDTO,
  AuthRequestDTO,
} from './dto';

import { UserService } from '../users';
import { TypeToken } from './types';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async authorize(
    authRequestDTO: AuthRequestDTO,
  ): Promise<AuthResponseDTO> {
    const foundUser = await this.userService.getUser(authRequestDTO);

    const matchedPassword = await bcrypt.compare(
      authRequestDTO.password,
      foundUser.password,
    );

    if (!matchedPassword) {
      throw new UnauthorizedException('The user password is wrong.');
    }

    if (!foundUser.activated) {
      throw new ForbiddenException(
        `The user ${authRequestDTO.password} hasn't activated yet`,
      );
    }

    const tokenPayload: TypeToken = {
      username: foundUser.username,
      role: foundUser.role,
    };

    const token = JWT.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return { token };
  }

  public async registration(
    registrationRequestDTO: RegistrationRequestDTO,
  ): Promise<RegistrationResponseDTO> {
    return await this.userService.createUser(registrationRequestDTO);
  }
}
