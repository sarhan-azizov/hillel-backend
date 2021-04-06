import { MongoRepository } from 'typeorm';

import { ENTITY_NAMES } from '../../../ENTITY_NAMES';
import { UserEntity } from '../user.entity';
import { UsersAggregationInterface } from './user.interface';
import { UserParams, UserQueryParams } from './types';
import { ReadUsersResponseDTO } from '../dto';
import { caseInsensitive } from '../../../shared/helpers';

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
      page: params.page,
      size: params.size,
    };
  }

  private async getAggregatedUsers(
    params: UserQueryParams = {},
  ): Promise<ReadUsersResponseDTO> {
    const { page = 1, size = 10 } = params;
    const $skip = size * (page - 1);
    const $limit = size + $skip;

    const aggregationResult = [
      { $match: { activated: params.activated } },
      { $sort: { username: 1 } },
      this.joinRolesToUsers,
      this.setRoleToUser,
      { $limit },
      { $skip },
    ];

    if (!('activated' in params)) {
      aggregationResult.shift();
    }

    const aggregatedResult: ReadUsersResponseDTO[] = await this.userRepository
      .aggregate([
        { $facet: { result: aggregationResult, total: [{ $count: 'total' }] } },
      ])
      .toArray();

    return this.getAggregatedUsersResponse(aggregatedResult, params);
  }

  private async getAggregatedUser(params: UserParams): Promise<UserEntity> {
    const aggregation = [
      {
        $match: {
          username: {
            $regex: caseInsensitive(params.username),
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

  public async getUser(params: UserParams): Promise<UserEntity> {
    if (!params.username) {
      return undefined;
    }

    return await this.getAggregatedUser(params);
  }

  public async getUsers(
    params: UserQueryParams,
  ): Promise<ReadUsersResponseDTO> {
    return await this.getAggregatedUsers(params);
  }
}
