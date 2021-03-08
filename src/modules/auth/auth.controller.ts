import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';

import {
  AuthRequestDTO,
  RegistrationRequestDTO,
  RegistrationResponseDTO,
} from './dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiQuery({ name: 'username', type: 'string' })
  @ApiQuery({ name: 'password', type: 'string' })
  @ApiResponse({
    status: 200,
    description: `User authorization by JWT`,
    type: AuthRequestDTO,
  })
  @Get('/auth')
  public async authorization(
    @Query() authRequestDTO: AuthRequestDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { token }: { token: string } = await this.authService.authorize(
      authRequestDTO,
    );
    const bearerToken = 'Bearer ' + token;

    response.header('Authorization', bearerToken);
    response.cookie('Authorization', bearerToken);
    response.send({ token: bearerToken });
  }

  @ApiBody({ type: RegistrationRequestDTO })
  @ApiResponse({
    status: 201,
    description: `Return registered user`,
    type: RegistrationResponseDTO,
  })
  @Post('/registration')
  public async registration(
    @Body() registrationRequestDTO: RegistrationRequestDTO,
  ): Promise<RegistrationResponseDTO> {
    return await this.authService.registration(registrationRequestDTO);
  }
}
