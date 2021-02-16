import { UserAuthorizationResponseDTO } from '../dto';

export const mockedAuthorizedUser = {
  username: 'admin',
  password: 'password',
};

export const mockedAuthorizedToken: UserAuthorizationResponseDTO = {
  token: 'token',
};

export const mockedAuthorizedResponse = 'Bearer ' + mockedAuthorizedToken.token;
