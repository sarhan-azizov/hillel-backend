import { Controller, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { RegistrationService } from './registration.service';
import { RegistrationRequestDTO } from './registration-request.dto';
import { RegistrationResponseDTO } from './registration-response.dto';

@ApiTags('Registration')
@Controller('registration')
export class RegistrationController {
  constructor(private registrationService: RegistrationService) {}

  @ApiOperation({ summary: 'Registration' })
  @ApiBody({ type: RegistrationRequestDTO })
  @ApiResponse({
    status: 201,
    description: `Return registered user`,
    type: RegistrationResponseDTO,
  })
  @Post()
  public async registration(
    @Body() registrationRequestDTO: RegistrationRequestDTO,
  ): Promise<RegistrationResponseDTO> {
    return await this.registrationService.registration(registrationRequestDTO);
  }
}
