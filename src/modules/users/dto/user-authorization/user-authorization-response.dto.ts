import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAuthorizationResponseDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
