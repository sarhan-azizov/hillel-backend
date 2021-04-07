import { MongoRepository } from 'typeorm';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { ENTITY_NAMES } from '../../../ENTITY_NAMES';
import { UserEntity } from '../user.entity';
import { UsersAggregationInterface } from './user.interface';
import { UserParams, UserQueryParams } from './types';
import { ReadUsersResponseDTO } from '../dto';
import { caseInsensitive } from '../../../shared/helpers';
import { TypeAggregationOptions } from '../types';

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
    $set: {
      role: {
        $cond: [
          { $arrayElemAt: ['$role.name', 0] },
          { $arrayElemAt: ['$role.name', 0] },
          null,
        ],
      },
    },
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

  private async getAggregatedUsers({
    page = 1,
    size = 10,
    activated,
  }: UserQueryParams = {}): Promise<ReadUsersResponseDTO> {
    const $skip = size * (page - 1);
    const $limit = size + $skip;

    const aggregationResult = [
      { $match: { activated } },
      { $sort: { username: 1 } },
      this.joinRolesToUsers,
      this.setRoleToUser,
      { $limit },
      { $skip },
      { $unset: ['password'] },
    ];

    const aggregationTotal = [{ $match: { activated } }, { $count: 'total' }];

    if (activated === undefined) {
      aggregationResult.shift();
      aggregationTotal.shift();
    }

    const aggregatedResult: ReadUsersResponseDTO[] = await this.userRepository
      .aggregate([
        { $facet: { result: aggregationResult, total: aggregationTotal } },
      ])
      .toArray();

    return this.getAggregatedUsersResponse(aggregatedResult, { page, size });
  }

  private async getAggregatedUser(
    params: UserParams,
    aggregationOptions: TypeAggregationOptions,
  ): Promise<UserEntity> {
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
      { $unset: ['password'] },
    ];

    if (aggregationOptions?.withPassword) {
      aggregation.pop();
    }

    const aggregatedUser = await this.userRepository
      .aggregate(aggregation)
      .toArray();

    return aggregatedUser.length ? aggregatedUser[0] : undefined;
  }

  public async getUser(
    params: UserParams,
    aggregationOptions: TypeAggregationOptions,
  ): Promise<UserEntity> {
    if (!params.username) {
      return undefined;
    }

    return await this.getAggregatedUser(params, aggregationOptions);
  }

  public async getUsers(
    params: UserQueryParams,
  ): Promise<ReadUsersResponseDTO> {
    const users = await this.getAggregatedUsers(params);

    const errors = await validate(plainToClass(ReadUsersResponseDTO, users));

    if (errors.length) {
      throw new Error(JSON.stringify(errors, null, 2));
    }

    return users;
  }
}
