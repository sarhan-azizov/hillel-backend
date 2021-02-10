import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as JWT from 'jsonwebtoken';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  GetUserRequestDTO,
  GetUserResponseDTO,
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
  UserAuthorizationResponseDTO,
  UserAuthorizationRequestDTO,
  UserChangePasswordRequestDTO,
  GetUserQueryDTO,
} from './dto';
import { SharedDeleteResponseDTO } from '../../shared/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  public async authorize(
    authorizationDTO: UserAuthorizationRequestDTO,
  ): Promise<UserAuthorizationResponseDTO> {
    const foundUser = await this.getUser(authorizationDTO);

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

    const tokenPayload = {
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
    return await this.userRepository.createUser(createUserRequestDTO);
  }

  public async getUser(
    getUserRequestDTO: GetUserRequestDTO,
  ): Promise<UserEntity> {
    return await this.userRepository.getUser(getUserRequestDTO);
  }

  public async getUsers(
    getUserQueryDTO: GetUserQueryDTO,
  ): Promise<Array<GetUserResponseDTO>> {
    return await this.userRepository.getUsers(getUserQueryDTO);
  }

  public async updateUser(
    username: string,
    updateUserRequestDTO: Partial<UpdateUserRequestDTO>,
  ): Promise<UpdateUserResponseDTO> {
    return await this.userRepository.updateUser(username, updateUserRequestDTO);
  }

  public async deleteUser(username: string): Promise<SharedDeleteResponseDTO> {
    return await this.userRepository.deleteUser(username);
  }
}
