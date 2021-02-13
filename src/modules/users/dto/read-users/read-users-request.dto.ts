import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ReadUsersRequestDTO {
  @ApiProperty({ required: false })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  activated: boolean;

  @ApiProperty({ required: false, type: 'number', default: 10 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  size: number;

  @ApiProperty({ required: false, type: 'number', default: 1 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  page: number;
}
