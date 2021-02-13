import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReadUsersRequestDTO {
  @ApiProperty({ required: false })
  @IsString()
  activated: string;

  @ApiProperty({ required: false, default: '10' })
  @IsString()
  size: string;

  @ApiProperty({ required: false, default: '1' })
  @IsString()
  page: string;
}
