import { TypeUserRole } from '../user-roles';

export type TypeToken = {
  token: string;
};

export type TypeParsedToken = {
  username: string;
  role: TypeUserRole[];
};

export type TypeAuthRequest = {
  username: 'admin';
  password: 'password';
};
