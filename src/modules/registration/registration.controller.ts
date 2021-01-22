import { Controller, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

import { RegistrationService } from './registration.service';
import { RegistrationRequestDTO } from './registration-request.dto';
import { RegistrationResponseDTO } from './registration-response.dto';

@ApiTags('Registration')
@Controller('registration')
export class RegistrationController {
  constructor(private registrationService: RegistrationService) {}

  @ApiOperation({ summary: 'Registration' })
  @ApiResponse({
    status: 201,
    description: `Return registered user`,
    type: [RegistrationRequestDTO],
  })
  @ApiParam({
    name: 'user',
    type: 'string',
    description: 'the username is unique ',
  })
  @ApiParam({
    name: 'firstName',
    type: 'string',
  })
  @ApiParam({
    name: 'lastName',
    type: 'string',
  })
  @ApiParam({
    name: 'email',
    type: 'string',
  })
  @ApiParam({
    name: 'password',
    type: 'string',
  })
  @Post()
  public async registration(
    @Body() registrationRequestDTO: RegistrationRequestDTO,
  ): Promise<RegistrationResponseDTO> {
    return await this.registrationService.registration(registrationRequestDTO);
  }
}
