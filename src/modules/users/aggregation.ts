import { MongoRepository } from 'typeorm';

import { ENTITY_NAMES } from '../../ENTITY_NAMES';
import { UserEntity } from './user.entity';

type UserParams = {
  username?: string;
  activated?: string;
};

type MatchQuery = {
  username?: any;
  activated?: boolean;
};

export interface UsersWithRoleAggregationInterface {
  getUserWithRole(params: UserParams): Promise<UserEntity>;

  getUsersWithRole(params: UserParams): Promise<UserEntity[]>;
}

export class UsersWithRoleAggregation
  implements UsersWithRoleAggregationInterface {
  private userRepository: MongoRepository<UserEntity>;

  constructor(userRepository: MongoRepository<UserEntity>) {
    this.userRepository = userRepository;
  }

  private aggregation(matchQuery?: MatchQuery) {
    const generatedAggregation = [
      { $match: matchQuery },
      {
        $lookup: {
          from: ENTITY_NAMES.USER_ROLES,
          localField: 'role',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $set: { role: { $arrayElemAt: ['$role.name', 0] } },
      },
    ];

    if (!matchQuery) {
      generatedAggregation.shift();
    }

    return generatedAggregation;
  }

  private async getUsers(): Promise<UserEntity[]> {
    const aggregation = this.aggregation();
    const aggregatedUsers = await this.userRepository
      .aggregate(aggregation)
      .toArray();

    return aggregatedUsers;
  }

  private async getUser(username): Promise<UserEntity> {
    const aggregation = this.aggregation({
      username: {
        $regex: new RegExp(['^', username, '$'].join(''), 'i'),
      },
    });
    const aggregatedUser = await this.userRepository
      .aggregate(aggregation)
      .toArray();

    return aggregatedUser.length ? aggregatedUser[0] : undefined;
  }

  private async getUsersByQuery(activated): Promise<UserEntity[]> {
    const aggregation = this.aggregation({
      activated: activated === 'true',
    });
    const aggregatedUsers = await this.userRepository
      .aggregate(aggregation)
      .toArray();

    return aggregatedUsers;
  }

  public async getUserWithRole(params: UserParams): Promise<UserEntity> {
    if (!params.username) {
      return undefined;
    }

    return await this.getUser(params.username);
  }

  public async getUsersWithRole(params: UserParams): Promise<UserEntity[]> {
    if (params.activated) {
      return await this.getUsersByQuery(params.activated);
    }

    return await this.getUsers();
  }
}
