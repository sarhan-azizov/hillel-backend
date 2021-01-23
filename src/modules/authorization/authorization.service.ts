import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as JWT from 'jsonwebtoken';

import { UserService } from '../users';
import { AuthorizationRequestDTO } from './authorization-request.dto';
import { AuthorizationResponseDTO } from './authorization-response.dto';

@Injectable()
export class AuthorizationService {
  constructor(private userService: UserService) {}

  public async authorize(
    authorizationDTO: AuthorizationRequestDTO,
  ): Promise<AuthorizationResponseDTO> {
    const foundUser = await this.userService.getUser(authorizationDTO);

    const matchedPassword = await bcrypt.compare(
      authorizationDTO.password,
      foundUser.password,
    );

    if (!matchedPassword) {
      throw new UnauthorizedException();
    }

    if (!foundUser.activated) {
      throw new ForbiddenException();
    }

    const tokenPayload = {
      username: foundUser.username,
      role: foundUser.role,
    };

    const token = JWT.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
  }
}
