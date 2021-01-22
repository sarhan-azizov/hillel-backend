export const getUserWithRole = async (userRepository, user) => {
  const getUserWithRole = await userRepository
    .aggregate([
      {
        $match: {
          user,
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
