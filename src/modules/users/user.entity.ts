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
  OneToMany,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RoleEntity } from '../roles';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @OneToMany((type) => RoleEntity, (role) => role.user, { nullable: true })
  @JoinColumn()
  role: RoleEntity;

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

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

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
