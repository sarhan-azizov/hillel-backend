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
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  UserRequestDTO,
  UserResponseDTO,
  UsersResponseDTO,
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
  UserAuthorizationResponseDTO,
  UserAuthorizationRequestDTO,
  UserChangePasswordRequestDTO,
  UserQueryRequestDTO,
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
  ): Promise<UpdateUserResponseDTO> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(
      userChangePasswordRequestDTO.password,
      salt,
    );

    return this.updateUser(username, { password });
  }

  public async registration(
    createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    const registeredUser = await this.createUser(createUserRequestDTO);

    return registeredUser;
  }

  public async createUser(
    createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    const createdUser = await this.userRepository.createUser(
      createUserRequestDTO,
    );

    return Object.assign(new CreateUserResponseDTO(), createdUser);
  }

  public async getUser(
    userRequestDTO: UserRequestDTO,
  ): Promise<UserResponseDTO> {
    const foundUser = await this.userRepository.getUser(userRequestDTO);
    return Object.assign(new UserResponseDTO(), foundUser);
  }

  public async getUsers(
    userQueryRequestDTO: UserQueryRequestDTO,
  ): Promise<UsersResponseDTO> {
    const foundUsers = await this.userRepository.getUsers(userQueryRequestDTO);

    return Object.assign(new UsersResponseDTO(), foundUsers);
  }

  public async updateUser(
    username: string,
    updateUserRequestDTO: Partial<UpdateUserRequestDTO>,
  ): Promise<UpdateUserResponseDTO> {
    const updatedUser = await this.userRepository.updateUser(
      username,
      updateUserRequestDTO,
    );
    return Object.assign(new UpdateUserResponseDTO(), updatedUser);
  }

  public async deleteUser(username: string): Promise<SharedDeleteResponseDTO> {
    const deletedUser = await this.userRepository.deleteUser(username);
    return Object.assign(new SharedDeleteResponseDTO(), deletedUser);
  }
}
