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

    return {
      id: registeredUser.id,
      username: registeredUser.username,
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
      email: registeredUser.email,
      password: registeredUser.password,
      createdAt: registeredUser.createdAt,
      updatedAt: registeredUser.updatedAt,
    };
  }
}
