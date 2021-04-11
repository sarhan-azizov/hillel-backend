import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  Res,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Response, Request } from 'express';

import { AuthGuard } from '../../shared/guards/authorization.guard';
import { getVerifiedToken, removeToken } from '../../shared/helpers';
import { UserRolesDecorator } from '../../shared/decorators/roles.decorator';
import { UserService } from './user.service';
import { UserRoles } from '../user-roles';

import {
  UserChangePasswordRequestDTO,
  ReadUsersRequestDTO,
  ReadUsersResponseDTO,
  ReadUserResponseDTO,
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
} from './dto';

import { TypeSharedDelete, TypeSharedGetList } from '../../shared';
import { TypeGetUser } from './types';

@ApiTags('Users')
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiBody({
    type: UserChangePasswordRequestDTO,
  })
  @ApiResponse({
    status: 200,
    description: `Return user with changed password and request re-login`,
    type: UpdateUserResponseDTO,
  })
  @Patch('change-password')
  public async changePassword(
    @Req() request: Request,
    @Res() response: Response,
    @Body() userChangePasswordRequestDTO: UserChangePasswordRequestDTO,
  ): Promise<void> {
    const decodedToken = await getVerifiedToken(request);
    const updatedUser = await this.userService.changePassword(
      decodedToken.username,
      userChangePasswordRequestDTO,
    );

    removeToken(response);

    response.send(updatedUser);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @UserRolesDecorator(UserRoles.ADMIN, UserRoles.MENTOR)
  @ApiQuery({ required: false, name: 'activated', type: 'boolean' })
  @ApiQuery({ required: false, name: 'size', type: 'number' })
  @ApiQuery({ required: false, name: 'page', type: 'number' })
  @ApiResponse({
    status: 200,
    description: `Return users`,
    type: ReadUsersResponseDTO,
  })
  @Get()
  public async getUsers(
    @Query() readUsersRequestDTO: ReadUsersRequestDTO,
  ): Promise<TypeSharedGetList<TypeGetUser>> {
    return await this.userService.getUsers(readUsersRequestDTO);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @UserRolesDecorator(UserRoles.ADMIN, UserRoles.MENTOR)
  @ApiResponse({
    status: 200,
    description: `Return updated user`,
    type: UpdateUserResponseDTO,
  })
  @ApiBody({ type: UpdateUserRequestDTO })
  @Patch('/:username')
  public async updateUser(
    @Body() updateUserRequestDTO: UpdateUserRequestDTO,
    @Param('username') username: string,
  ): Promise<TypeGetUser> {
    return await this.userService.updateUser(username, updateUserRequestDTO);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @UserRolesDecorator(UserRoles.ADMIN, UserRoles.MENTOR)
  @ApiResponse({
    status: 200,
    description: `Return the user`,
    type: ReadUserResponseDTO,
  })
  @Get('/:username')
  public async getUser(
    @Param('username') username: string,
  ): Promise<TypeGetUser> {
    return await this.userService.getUser({ username });
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @UserRolesDecorator(UserRoles.ADMIN, UserRoles.MENTOR)
  @ApiResponse({
    status: 200,
    description: `Delete user`,
  })
  @Delete('/:username')
  public async deleteUser(
    @Param('username') username: string,
  ): Promise<TypeSharedDelete> {
    await this.userService.deleteUser(username);

    return {
      status: 200,
      msg: `the username "${username}" succeed deleted`,
    };
  }
}
