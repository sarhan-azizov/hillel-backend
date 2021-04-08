import { ObjectID } from 'mongodb';
import {
  TypeUserWithPassword,
  TypeGetUsers,
  TypeGetUserWithPassword,
} from '../types';

import { TypeUserRole } from '../../user-roles';

export const mockedRegisterUserRole: TypeUserRole = {
  id: ObjectID('6027a23b3cdd5143e08f0941'),
  name: 'student',
};

export const mockedUserResponse: TypeGetUserWithPassword = {
  id: ObjectID('6027a23b3cdd5143e08f0941'),
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

export const mockedUserRequest: TypeUserWithPassword = {
  username: 'Randy_Dietrich95',
  firstName: 'Juwan',
  lastName: 'Wyman',
  email: 'Kathryn_Jaskolski@gmail.com',
  password: '$2b$10$4JM73wQpKhgiNdTdlzKQ8Ovt6QBMJSiEESBH/zjennMPJqMvljFva',
  activated: true,
};

export const mockedUsersResponse: TypeGetUsers = {
  result: [
    {
      id: ObjectID('6027a23b3cdd5143e08f0941'),
      username: 'Randy_Dietrich95',
      firstName: 'Juwan',
      lastName: 'Wyman',
      role: [],
      email: 'Kathryn_Jaskolski@gmail.com',
      activated: true,
      createdAt: new Date('2021-02-13T09:56:11.703+0000'),
      updatedAt: new Date('2021-02-13T09:56:11.703+0000'),
    },
    {
      id: ObjectID('6027a23b3cdd5143e08f0942'),
      username: 'Dawson56',
      firstName: 'Dawson',
      lastName: 'Deckow',
      role: [],
      email: 'Kathryn_Jaskolski@gmail.com',
      activated: true,
      createdAt: new Date('2021-02-13T09:56:11.703+0000'),
      updatedAt: new Date('2021-02-13T09:56:11.703+0000'),
    },
  ],
  total: 10,
  size: 2,
  page: 1,
};
