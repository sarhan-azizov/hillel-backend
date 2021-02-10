import { ENTITY_NAMES } from '../../ENTITY_NAMES';

type UserParams = {
  username?: string;
  activated?: string;
};

type MatchQuery = {
  username?: any;
  activated?: boolean;
};

export const getUsersWithRole = async (
  userRepository,
  params: UserParams = {},
) => {
  const matchQuery: MatchQuery = {};

  if (params.username) {
    matchQuery.username = {
      $regex: new RegExp(['^', params.username, '$'].join(''), 'i'),
    };
  }

  if (params.activated) {
    matchQuery.activated = params.activated === 'true';
  }

  const aggregation = [
    {
      $match: matchQuery,
    },
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

  const getUsersWithRole = await userRepository.aggregate(aggregation).toArray();

  if (!params.username) {
    return getUsersWithRole;
  }

  return getUsersWithRole.length ? getUsersWithRole[0] : undefined;
};
