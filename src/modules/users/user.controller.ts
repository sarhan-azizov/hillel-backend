import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';

import { RolesGuard } from '../../shared/guards/authorization.guard';
import { UserRoles } from '../../shared/decorators/roles.decorator';
import { UserService } from './user.service';

import {
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
  GetUserRequestDTO,
  GetUserResponseDTO,
  UserAuthorizationRequestDTO,
  UserAuthorizationResponseDTO,
  CreateUserRequestDTO,
  CreateUserResponseDTO,
} from './dto';

@ApiTags('Users')
@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiQuery({ name: 'username', type: 'string' })
  @ApiQuery({ name: 'password', type: 'string' })
  @ApiResponse({
    status: 200,
    description: `Return authorized token`,
    type: UserAuthorizationResponseDTO,
  })
  @Get('authorization')
  public async authorization(
    @Query() userAuthorizationRequestDTO: UserAuthorizationRequestDTO,
    @Res() response: Response,
  ): Promise<UserAuthorizationResponseDTO> {
    const token: UserAuthorizationResponseDTO = await this.userService.authorize(
      userAuthorizationRequestDTO,
    );
    const bearerToken = 'Bearer ' + token;

    response.set('Authorization', bearerToken);
    response.send({ token: bearerToken });

    return token;
  }

  @ApiBody({ type: CreateUserRequestDTO })
  @ApiResponse({
    status: 201,
    description: `Return registered user`,
    type: GetUserResponseDTO,
  })
  @Post('/registration')
  public async registration(
    @Body() createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return await this.userService.registration(createUserRequestDTO);
  }

  @ApiBearerAuth()
  @UserRoles('admin')
  @ApiResponse({
    status: 200,
    description: `Return created users`,
    type: [GetUserResponseDTO],
  })
  @Get()
  public async getUsers(): Promise<Array<GetUserResponseDTO>> {
    return await this.userService.getUsers();
  }

  @ApiBearerAuth()
  @UserRoles('admin')
  @ApiResponse({
    status: 200,
    description: `Return updated user`,
    type: UpdateUserResponseDTO,
  })
  @ApiBody({ type: UpdateUserRequestDTO })
  @Patch('/:username')
  public async updateUser(
    @Body() updateUserRequestDTO: Partial<UpdateUserRequestDTO>,
    @Param('username') username: string,
  ): Promise<UpdateUserResponseDTO> {
    return await this.userService.updateUser(username, updateUserRequestDTO);
  }
}
