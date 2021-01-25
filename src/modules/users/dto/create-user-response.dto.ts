import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'typeorm';
import { IsMongoId, IsBoolean } from 'class-validator';

import { BaseUserDTO } from './base-user.dto';

export class CreateUserResponseDTO extends BaseUserDTO {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsMongoId()
  id: ObjectID;

  @ApiProperty({
    default: false,
  })
  @IsBoolean()
  activated: boolean;
}
