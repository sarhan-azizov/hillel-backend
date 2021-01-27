import { Entity, ObjectID, Column, ObjectIdColumn, BaseEntity } from 'typeorm';

import { ENTITY_NAMES } from '../../../ENTITY_NAMES';

export enum UserRoles {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  STUDENT = 'student',
}

@Entity(ENTITY_NAMES.USER_ROLES)
export class UserRoleEntity extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ type: 'enum', unique: true, nullable: false })
  name: UserRoles;
}
