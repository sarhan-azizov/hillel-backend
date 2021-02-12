import { MongoRepository } from 'typeorm';

import { ENTITY_NAMES } from '../../../ENTITY_NAMES';
import { UserEntity } from '../user.entity';
import { UsersAggregationInterface } from './user.interface';
import {
  UserParams,
  UserQueryParams,
  AggregatedUsers,
  PaginationParams,
} from './types';

export class UsersAggregation implements UsersAggregationInterface {
  private userRepository: MongoRepository<UserEntity>;
  private joinRolesToUsers = {
    $lookup: {
      from: ENTITY_NAMES.USER_ROLES,
      localField: 'role',
      foreignField: '_id',
      as: 'role',
    },
  };
  private setRoleToUser = {
    $set: { role: { $arrayElemAt: ['$role.name', 0] } },
  };

  constructor(userRepository: MongoRepository<UserEntity>) {
    this.userRepository = userRepository;
  }

  private getAggregatedUsersResponse(aggregatedResult, params) {
    const aggregatedUsers = aggregatedResult.length
      ? aggregatedResult[0]
      : { result: [], total: [{ total: 0 }], page: 0, size: 10 };

    return {
      result: aggregatedUsers.result,
      total: aggregatedUsers.total[0].total,
      page: Number(params.page),
      size: Number(params.size),
    };
  }

  private async getAggregatedUsers(
    params: PaginationParams = { page: 0, size: 10 },
  ): Promise<AggregatedUsers> {
    const aggregatedResult: AggregatedUsers[] = await this.userRepository
      .aggregate([
        {
          $facet: {
            result: [
              { $sort: { username: 1 } },
              this.joinRolesToUsers,
              this.setRoleToUser,
            ],
            total: [{ $count: 'total' }],
          },
        },
      ])
      .toArray();

    return this.getAggregatedUsersResponse(aggregatedResult, params);
  }

  private async getAggregatedUser(params: UserParams): Promise<UserEntity> {
    const aggregation = [
      {
        $match: {
          username: {
            $regex: new RegExp(['^', params.username, '$'].join(''), 'i'),
          },
        },
      },
      this.joinRolesToUsers,
      this.setRoleToUser,
    ];
    const aggregatedUser = await this.userRepository
      .aggregate(aggregation)
      .toArray();

    return aggregatedUser.length ? aggregatedUser[0] : undefined;
  }

  private async getAggregatedUsersByQuery(
    params: UserQueryParams,
  ): Promise<AggregatedUsers> {
    const aggregation = [
      { $match: { activated: params.activated === 'true' } },
      {
        $facet: {
          result: [
            { $sort: { username: 1 } },
            this.joinRolesToUsers,
            this.setRoleToUser,
          ],
          total: [{ $count: 'total' }],
        },
      },
    ];

    const aggregatedResult = await this.userRepository
      .aggregate(aggregation)
      .toArray();

    return this.getAggregatedUsersResponse(aggregatedResult, params);
  }

  public async getUser(params: UserParams): Promise<UserEntity> {
    if (!params.username) {
      return undefined;
    }

    return await this.getAggregatedUser(params);
  }

  public async getUsers(params: UserQueryParams): Promise<AggregatedUsers> {
    if (params.activated) {
      return await this.getAggregatedUsersByQuery(params);
    }

    return await this.getAggregatedUsers();
  }
}
