import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'typeorm';
import {
  IsMongoId,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class ReadUserRolesResponseDTO {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsMongoId()
  _id: ObjectID;

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
}
