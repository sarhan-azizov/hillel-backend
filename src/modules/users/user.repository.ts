import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository, EntityRepository, getMongoRepository } from 'typeorm';

import { UserEntity } from './user.entity';
import {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  GetUserQueryDTO,
  GetUserRequestDTO,
  GetUserResponseDTO,
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
} from './dto';
import { getUsersWithRole } from './aggregation';
import { SharedDeleteResponseDTO } from '../../shared/dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public async createUser(
    createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    const foundUser = await this.getUserByUserField(
      createUserRequestDTO.username,
    );

    if (!foundUser) {
      const createdUser = Object.assign(new UserEntity(), createUserRequestDTO);

      await createdUser.save();

      return createdUser;
    }

    throw new ConflictException(
      `The such user "${foundUser.username}" is exist.`,
    );
  }

  public async getUser(
    getUserRequestDTO: GetUserRequestDTO,
  ): Promise<UserEntity> {
    const userRepository = getMongoRepository(UserEntity);
    const foundUserWithRole = await getUsersWithRole(
      userRepository,
      getUserRequestDTO,
    );

    if (!foundUserWithRole) {
      throw new NotFoundException();
    }

    return foundUserWithRole;
  }

  public async getUsers(
    getUserQueryDTO: GetUserQueryDTO,
  ): Promise<Array<GetUserResponseDTO>> {
    const userRepository = getMongoRepository(UserEntity);

    return await getUsersWithRole(userRepository, getUserQueryDTO);
  }

  public async getUserByUserField(username): Promise<GetUserResponseDTO> {
    const userRepository = getMongoRepository(UserEntity);

    return await userRepository.findOne({
      username,
    });
  }

  public async updateUser(
    username: string,
    updateUserRequestDTO: Partial<UpdateUserRequestDTO>,
  ): Promise<UpdateUserResponseDTO> {
    const userRepository = getMongoRepository(UserEntity);
    const updatedUser = await userRepository.findOneAndUpdate(
      { username },
      { $set: updateUserRequestDTO },
    );

    if (updatedUser.ok) {
      return this.getUser({ username });
    }
  }

  public async deleteUser(username: string): Promise<SharedDeleteResponseDTO> {
    const userRepository = getMongoRepository(UserEntity);
    const deletedResponse = await userRepository.deleteOne({ username });

    if (!deletedResponse.deletedCount) {
      throw new NotFoundException(`the username "${username}" does not exist`);
    }

    return {
      status: 200,
      msg: `the username "${username}" succeed deleted`,
    };
  }
}
