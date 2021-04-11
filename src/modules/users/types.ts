import { TypeUserRole } from '../user-roles';
import { ObjectID } from 'typeorm';

export type TypeBaseUser = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  activated: boolean;
};

export type TypeCreateUser = TypeBaseUser & {
  role: ObjectID;
  password: string;
};

export type TypeUserWithPassword = TypeBaseUser & {
  password: string;
};

export type TypeGetUser = TypeBaseUser & {
  _id: ObjectID;
  role: TypeUserRole[];
  createdAt: Date;
  updatedAt: Date;
};

export type TypeGetUserWithPassword = TypeUserWithPassword & TypeGetUser;

export type TypeAggregationOptions = {
  withPassword: boolean;
};
