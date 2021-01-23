import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import * as JWT from 'jsonwebtoken';

import { AuthorizationRequestDTO } from './authorization-request.dto';
import { AuthorizationResponseDTO } from './authorization-response.dto';
import { AuthorizationService } from './authorization.service';

@ApiTags('Authorization')
@Controller()
export class AuthorizationController {
  constructor(private authorizationService: AuthorizationService) {}

  @ApiOperation({ summary: 'Authorization' })
  @ApiQuery({ name: 'username', type: 'string' })
  @ApiQuery({ name: 'password', type: 'string' })
  @ApiResponse({
    status: 200,
    description: `Return authorized token`,
  })
  @Get('authorization')
  public async authorization(
    @Query() authorizationRequestDTO: AuthorizationRequestDTO,
    @Res() response: Response,
  ): Promise<AuthorizationResponseDTO> {
    const authorizedUser: AuthorizationResponseDTO = await this.authorizationService.authorize(
      authorizationRequestDTO,
    );
    const tokenPayload = {
      username: authorizedUser.username,
      role: authorizedUser.role,
    };

    const token = JWT.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    response.set('Authorization', 'Bearer ' + token);

    response.send({
      token,
    });

    return authorizedUser;
  }
}
