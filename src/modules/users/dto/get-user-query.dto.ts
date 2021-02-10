import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserQueryDTO {
  @ApiProperty({ required: false })
  @IsBoolean()
  activated?: string;
}
