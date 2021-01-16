import { Entity, ObjectID, Column, ObjectIdColumn, BaseEntity } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  constructor() {
    super();
    this.activated = false;
  }

  @ObjectIdColumn()
  id: ObjectID;

  @Column({ type: 'string', unique: true, length: 80 })
  user: string;

  @Column({ type: 'string', length: 80 })
  firstName: string;

  @Column({ type: 'string', length: 80 })
  lastName: string;

  @Column({ type: 'string', length: 120 })
  email: string;

  @Column({ type: 'string', length: 40 })
  password: string;

  @Column({ type: 'boolean' })
  activated: boolean;
}
