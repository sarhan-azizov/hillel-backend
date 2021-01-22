import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository, EntityRepository, getMongoRepository } from 'typeorm';

import { UserEntity } from './user.entity';
import { CreateUserDTO, GetUserDto } from './dto';
import { getUserWithRole } from './aggregation';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const foundUser = await this.getUserByUserField(createUserDTO.user);

    if (!foundUser) {
      const createdUser = Object.assign(new UserEntity(), createUserDTO);

      await createdUser.save();

      return createdUser;
    }

    throw new ConflictException(`The such user ${foundUser.user} is exist.`);
  }

  public async getUser(getUserDto: GetUserDto): Promise<UserEntity> {
    const userRepository = getMongoRepository(UserEntity);
    const foundUserWithRole = await getUserWithRole(
      userRepository,
      getUserDto.user,
    );

    if (!foundUserWithRole) {
      throw new NotFoundException();
    }

    return foundUserWithRole;
  }

  public async getUserByUserField(user): Promise<UserEntity> {
    const userRepository = getMongoRepository(UserEntity);
    const foundUser = await userRepository.findOne({
      user,
    });

    return foundUser;
  }
}
