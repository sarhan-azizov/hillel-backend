import {
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateIf,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { toBoolean, isUndefined, toNumber } from '../../../../shared/helpers';

export class ReadUsersRequestDTO {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, type: 'boolean' })
  @ValidateIf(isUndefined)
  @Transform(toBoolean)
  activated: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, type: 'number', default: 10 })
  @Transform(toNumber)
  @ValidateIf(isUndefined)
  @Min(1)
  size: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, type: 'number', default: 1 })
  @Transform(toNumber)
  @ValidateIf(isUndefined)
  @Min(1)
  page: number;
}
