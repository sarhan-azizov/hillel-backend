import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, ObjectID, UpdateDateColumn } from 'typeorm';
import {
  IsMongoId,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateGroupResponseDTO {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsMongoId()
  id: ObjectID;

  // @ApiProperty({
  //   required: true,
  //   type: String,
  // })
  // @IsMongoId()
  // id: ObjectID;
  // course: string;

  @ApiProperty({
    required: true,
    maxLength: 80,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
