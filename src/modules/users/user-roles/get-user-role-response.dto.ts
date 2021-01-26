import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'typeorm';
import {
  IsMongoId,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class GetUserRoleResponseDTO {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsMongoId()
  id: ObjectID;

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