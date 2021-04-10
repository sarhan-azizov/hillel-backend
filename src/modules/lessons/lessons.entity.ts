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

import { ENTITY_NAMES } from '../../ENTITY_NAMES';

@Entity(ENTITY_NAMES.LESSONS)
export class LessonsEntity extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ type: 'string', unique: true, length: 120, nullable: false })
  name: string;

  @Column({ type: 'string', length: 500, nullable: true })
  description: string;

  @Column({ type: 'boolean', nullable: false })
  activated: boolean;

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
