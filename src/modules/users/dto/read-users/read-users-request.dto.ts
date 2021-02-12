import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReadUsersRequestDTO {
  @ApiProperty({ required: false })
  @IsBoolean()
  activated: string;
}
