import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository, EntityRepository, getMongoRepository } from 'typeorm';

import { UserEntity } from './user.entity';
import { CreateUserDTO, GetUserDto } from './dto';

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

  public async getUser(receivedUserDTO: GetUserDto): Promise<UserEntity> {
    const foundUser = await this.getUserByUserField(receivedUserDTO.user);

    if (!foundUser) {
      throw new NotFoundException();
    }

    return await this.getUserByUserField(receivedUserDTO.user);
  }

  public async getUserByUserField(user): Promise<UserEntity> {
    const userRepository = getMongoRepository(UserEntity);
    const foundUser = await userRepository.findOne({
      user,
    });

    return foundUser;
  }
}
