import { SetMetadata } from '@nestjs/common';

export const UserRolesDecorator = (...roles: string[]) =>
  SetMetadata('roles', roles);
