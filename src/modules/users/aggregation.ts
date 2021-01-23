export const getUserWithRole = async (userRepository, username) => {
  const getUserWithRole = await userRepository
    .aggregate([
      {
        $match: {
          username,
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
    ])
    .toArray();

  return getUserWithRole.length ? getUserWithRole[0] : getUserWithRole;
};
