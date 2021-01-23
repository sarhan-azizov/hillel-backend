import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';

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
    const token: AuthorizationResponseDTO = await this.authorizationService.authorize(
      authorizationRequestDTO,
    );

    response.set('Authorization', 'Bearer ' + token);

    response.send({ token });

    return token;
  }
}
