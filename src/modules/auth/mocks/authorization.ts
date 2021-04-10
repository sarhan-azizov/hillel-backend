import { TypeToken, TypeAuthRequest } from '../types';
import { ObjectID } from 'mongodb';

import { TypeCreateUser, TypeGetUserWithPassword } from '../../users';
import { TypeUserRole } from '../../user-roles';

export const mockedRegisterUserRole: TypeUserRole = {
  _id: ObjectID('6027a23b3cdd5143e08f0941'),
  name: 'student',
};

export const mockedRegisterUserRequest: TypeCreateUser = {
  username: 'Randy_Dietrich95',
  firstName: 'Juwan',
  lastName: 'Wyman',
  role: ObjectID('6027a23b3cdd5143e08f0941'),
  email: 'Kathryn_Jaskolski@gmail.com',
  password: '$2b$10$4JM73wQpKhgiNdTdlzKQ8Ovt6QBMJSiEESBH/zjennMPJqMvljFva',
  activated: true,
};

export const mockedRegisterUserResponse: TypeGetUserWithPassword = {
  _id: ObjectID('6027a23b3cdd5143e08f0941'),
  username: 'Randy_Dietrich95',
  firstName: 'Juwan',
  lastName: 'Wyman',
  role: [mockedRegisterUserRole],
  email: 'Kathryn_Jaskolski@gmail.com',
  password: '$2b$10$4JM73wQpKhgiNdTdlzKQ8Ovt6QBMJSiEESBH/zjennMPJqMvljFva',
  activated: true,
  createdAt: new Date('2021-02-13T09:56:11.703+0000'),
  updatedAt: new Date('2021-02-13T09:56:11.703+0000'),
};

export const mockedAuthorizedUser: TypeAuthRequest = {
  username: 'admin',
  password: 'password',
};

export const mockedAuthorizedToken: TypeToken = {
  token: 'token',
};

export const mockedAuthorizedResponse = 'Bearer ' + mockedAuthorizedToken.token;
