import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'typeorm';
import {
  IsMongoId,
  IsBoolean,
} from 'class-validator';

import { CreateUserRequestDTO } from './create-user-request.dto';

export class CreateUserResponseDTO extends CreateUserRequestDTO {
  constructor() {
    super();
  }
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
