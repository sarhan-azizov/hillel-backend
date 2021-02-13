import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as JWT from 'jsonwebtoken';

import { UserRepository } from './user.repository';
import {
  UserChangePasswordRequestDTO,
  UserChangePasswordResponseDTO,
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  ReadUserRequestDTO,
  ReadUserResponseDTO,
  ReadUsersRequestDTO,
  ReadUsersResponseDTO,
  UserAuthorizationRequestDTO,
  UserAuthorizationResponseDTO,
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
} from './dto';
import { SharedDeleteResponseDTO } from '../../shared/dto';
import { Token } from '../../shared/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  public async authorize(
    authorizationDTO: UserAuthorizationRequestDTO,
  ): Promise<UserAuthorizationResponseDTO> {
    const foundUser = await this.userRepository.getUser(authorizationDTO);

    const matchedPassword = await bcrypt.compare(
      authorizationDTO.password,
      foundUser.password,
    );

    if (!matchedPassword) {
      throw new UnauthorizedException('The user password is wrong.');
    }

    if (!foundUser.activated) {
      throw new ForbiddenException(
        `The user ${authorizationDTO.password} hasn't activated yet`,
      );
    }

    const tokenPayload: Token = {
      username: foundUser.username,
      role: foundUser.role,
    };

    const token = JWT.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
  }

  public async changePassword(
    username: string,
    userChangePasswordRequestDTO: UserChangePasswordRequestDTO,
  ): Promise<UserChangePasswordResponseDTO> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(
      userChangePasswordRequestDTO.password,
      salt,
    );

    return await this.userRepository.updateUser(username, { password });
  }

  public async registration(
    createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return await this.createUser(createUserRequestDTO);
  }

  public async createUser(
    createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return await this.userRepository.createUser(createUserRequestDTO);
  }

  public async getUser(
    readUserRequestDTO: ReadUserRequestDTO,
  ): Promise<ReadUserResponseDTO> {
    return await this.userRepository.getUser(readUserRequestDTO);
  }

  public async getUsers(
    readUsersRequestDTO: ReadUsersRequestDTO,
  ): Promise<ReadUsersResponseDTO> {
    return await this.userRepository.getUsers(readUsersRequestDTO);
  }

  public async updateUser(
    username: string,
    updateUserRequestDTO: UpdateUserRequestDTO,
  ): Promise<UpdateUserResponseDTO> {
    return await this.userRepository.updateUser(username, updateUserRequestDTO);
  }

  public async deleteUser(username: string): Promise<SharedDeleteResponseDTO> {
    return await this.userRepository.deleteUser(username);
  }
}
