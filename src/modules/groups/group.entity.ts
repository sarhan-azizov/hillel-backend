import {
  Entity,
  ObjectID,
  Column,
  ObjectIdColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { ENTITY_NAMES } from '../../ENTITY_NAMES';

@Entity(ENTITY_NAMES.GROUPS)
export class GroupEntity extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ type: 'string', unique: true, length: 80, nullable: true })
  name: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  private setCreateDate(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  public setUpdateDate(): void {
    this.updatedAt = new Date();
  }
}
