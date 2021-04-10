import {
  Entity,
  ObjectID,
  Column,
  ObjectIdColumn,
  BaseEntity,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ENTITY_NAMES } from '../../ENTITY_NAMES';

@Entity(ENTITY_NAMES.USERS)
export class UserEntity extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ type: 'array' })
  role: [];

  @Column({ type: 'string', unique: true, length: 80, nullable: false })
  username: string;

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

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }

  @BeforeInsert()
  async setActivated() {
    this.activated = false;
  }

  @BeforeInsert()
  private setCreateDate(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  public setUpdateDate(): void {
    this.updatedAt = new Date();
  }
}
