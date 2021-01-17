import {
  Entity,
  ObjectID,
  Column,
  ObjectIdColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../users';

export enum UserRoles {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  STUDENT = 'student',
}

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ type: 'enum', unique: true, nullable: false })
  name: UserRoles;

  @ManyToOne((type) => UserEntity, (user) => user.role, { nullable: true })
  user: UserEntity;
}
