import {
  Entity,
  ObjectID,
  Column,
  ObjectIdColumn,
  BaseEntity,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class UserEntity extends BaseEntity {
  constructor() {
    super();
    this.activated = false;
  }

  @ObjectIdColumn()
  id: ObjectID;

  @Column({ type: 'string', unique: true, length: 80, nullable: false })
  user: string;

  @Column({ type: 'string', length: 80, nullable: true })
  firstName: string;

  @Column({ type: 'string', length: 80, nullable: true })
  lastName: string;

  @Column({ type: 'string', length: 120, nullable: false })
  email: string;

  @Column({ type: 'string', length: 40, nullable: false })
  password: string;

  @Column({ type: 'boolean', nullable: false })
  activated: boolean;

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, salt);
  }
}
