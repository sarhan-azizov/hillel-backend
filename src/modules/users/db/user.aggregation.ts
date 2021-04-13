import { MongoRepository } from 'typeorm';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { ENTITY_NAMES } from '../../../ENTITY_NAMES';
import { UserEntity } from '../user.entity';
import { UsersAggregationInterface } from './user.interface';
import { ReadUsersRequestDTO, ReadUsersResponseDTO } from '../dto';
import { caseInsensitive } from '../../../shared/helpers';
import {
  TypeAggregationOptions,
  TypeGetUser,
  TypeGetUserWithPassword,
} from '../types';
import { TypeSharedGetList } from '../../../shared';

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

  constructor(userRepository: MongoRepository<UserEntity>) {
    this.userRepository = userRepository;
  }

  private getAggregatedUsersResponse(
    aggregatedResult,
    params,
  ): TypeSharedGetList<TypeGetUser> {
    const aggregatedUsers = aggregatedResult.length
      ? aggregatedResult[0]
      : { result: [], total: [{ total: 0 }], page: 0, size: 10 };

    return {
      result: aggregatedUsers.result,
      total: aggregatedUsers.total[0]?.total | 0,
      page: params.page,
      size: params.size,
    };
  }

  private async getAggregatedUsers({
    page = 1,
    size = 10,
    activated,
  }: ReadUsersRequestDTO = {}): Promise<TypeSharedGetList<TypeGetUser>> {
    const $skip = size * (page - 1);
    const $limit = size + $skip;

    const aggregationResult = [
      { $match: { activated } },
      { $sort: { createdAt: -1 } },
      this.joinRolesToUsers,
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
    params: { username: string },
    aggregationOptions: TypeAggregationOptions,
  ): Promise<TypeGetUserWithPassword> {
    const aggregation = [
      {
        $match: {
          username: {
            $regex: caseInsensitive(params.username),
          },
        },
      },
      this.joinRolesToUsers,
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
    params: { username: string },
    aggregationOptions: TypeAggregationOptions,
  ): Promise<TypeGetUserWithPassword> {
    if (!params.username) {
      return undefined;
    }

    return await this.getAggregatedUser(params, aggregationOptions);
  }

  public async getUsers(
    params: ReadUsersRequestDTO,
  ): Promise<TypeSharedGetList<TypeGetUser>> {
    const users = await this.getAggregatedUsers(params);

    const errors = await validate(plainToClass(ReadUsersResponseDTO, users));

    if (errors.length) {
      throw new Error(JSON.stringify(errors, null, 2));
    }

    return users;
  }
}
