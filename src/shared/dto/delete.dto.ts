import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SharedDeleteResponseDTO {
  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  status: 200;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 120,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  msg: string;
}
