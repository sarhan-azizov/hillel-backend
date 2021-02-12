import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserQueryRequestDTO {
  @ApiProperty({ required: false })
  @IsBoolean()
  activated?: string;
}
