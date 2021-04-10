import { ObjectID } from 'typeorm';

export type TypeBaseLesson = {
  name: string;
  description: string;
  activated: boolean;
};

export type TypeGetLesson = TypeBaseLesson & {
  id: ObjectID;
  createdAt: Date;
  updatedAt: Date;
};
