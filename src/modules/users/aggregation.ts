export const getUsersWithRole = async (userRepository, username?) => {
  const aggregation = [
    {
      $match: {
        username: {
          $regex: new RegExp(['^', username, '$'].join(''), 'i'),
        },
      },
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'role',
        foreignField: '_id',
        as: 'role',
      },
    },
    {
      $set: { role: { $arrayElemAt: ['$role.name', 0] } },
    },
  ];

  if (!username) {
    aggregation.shift();
  }

  const getUserWithRole = await userRepository.aggregate(aggregation).toArray();

  if (!username) {
    return getUserWithRole;
  }

  return getUserWithRole.length ? getUserWithRole[0] : undefined;
};
