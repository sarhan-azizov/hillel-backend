import { AuthResponseDTO } from '../dto';

export const mockedRegisterUserRequest = {
  username: 'Randy_Dietrich95',
  firstName: 'Juwan',
  lastName: 'Wyman',
  email: 'Kathryn_Jaskolski@gmail.com',
  password: '$2b$10$4JM73wQpKhgiNdTdlzKQ8Ovt6QBMJSiEESBH/zjennMPJqMvljFva',
  activated: true,
};

export const mockedRegisterUserResponse = {
  id: '6027a23b3cdd5143e08f0941',
  username: 'Randy_Dietrich95',
  firstName: 'Juwan',
  lastName: 'Wyman',
  email: 'Kathryn_Jaskolski@gmail.com',
  password: '$2b$10$4JM73wQpKhgiNdTdlzKQ8Ovt6QBMJSiEESBH/zjennMPJqMvljFva',
  activated: true,
  createdAt: '2021-02-13T09:56:11.703+0000',
  updatedAt: '2021-02-13T09:56:11.703+0000',
};

export const mockedAuthorizedUser = {
  username: 'admin',
  password: 'password',
};

export const mockedAuthorizedToken: AuthResponseDTO = {
  token: 'token',
};

export const mockedAuthorizedResponse = 'Bearer ' + mockedAuthorizedToken.token;
