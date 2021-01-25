import { Injectable } from '@nestjs/common';

import { UserService } from '../users';
import { RegistrationRequestDTO } from './registration-request.dto';
import { RegistrationResponseDTO } from './registration-response.dto';

@Injectable()
export class RegistrationService {
  constructor(private userService: UserService) {}

  public async registration(
    registrationRequestDTO: RegistrationRequestDTO,
  ): Promise<RegistrationResponseDTO> {
    const registeredUser = await this.userService.createUser(
      registrationRequestDTO,
    );

    return registeredUser;
  }
}
