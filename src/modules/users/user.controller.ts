import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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

import { RolesGuard } from '../../shared/guards/authorization.guard';
import { getVerifiedToken, removeToken } from '../../shared/helpers';
import { UserRoles } from '../../shared/decorators/roles.decorator';
import { UserService } from './user.service';

import {
  UserChangePasswordRequestDTO,
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  ReadUsersRequestDTO,
  ReadUsersResponseDTO,
  ReadUserResponseDTO,
  UserAuthorizationRequestDTO,
  UserAuthorizationResponseDTO,
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
} from './dto';
import { SharedDeleteResponseDTO } from '../../shared/dto';
import { TokenType } from './types';

@ApiTags('Users')
@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiQuery({ name: 'username', type: 'string' })
  @ApiQuery({ name: 'password', type: 'string' })
  @ApiResponse({
    status: 200,
    description: `User authorization by JWT`,
    type: UserAuthorizationResponseDTO,
  })
  @Get('authorization')
  public async authorization(
    @Query() userAuthorizationRequestDTO: UserAuthorizationRequestDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { token }: TokenType = await this.userService.authorize(
      userAuthorizationRequestDTO,
    );
    const bearerToken = 'Bearer ' + token;

    response.header('Authorization', bearerToken);
    response.cookie('Authorization', bearerToken);
    response.send({ token: bearerToken });
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: `User logout by removing JWT from header and cookie`,
  })
  @Get('logout')
  public async logout(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const decodedToken = await getVerifiedToken(request);

    removeToken(response);

    response.send({
      status: 200,
      msg: `The User ${decodedToken.username} was successfully logout`,
    });
  }

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

  @ApiBody({ type: CreateUserRequestDTO })
  @ApiResponse({
    status: 201,
    description: `Return registered user`,
    type: CreateUserResponseDTO,
  })
  @Post('/registration')
  public async registration(
    @Body() createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return await this.userService.registration(createUserRequestDTO);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @UserRoles('admin')
  @ApiQuery({ required: false, name: 'activated', type: 'boolean' })
  @ApiQuery({ required: false, name: 'size', type: 'number' })
  @ApiQuery({ required: false, name: 'page', type: 'number' })
  @ApiResponse({
    status: 200,
    description: `Return created users`,
    type: ReadUsersResponseDTO,
  })
  @Get()
  public async getUsers(
    @Query() readUsersRequestDTO: ReadUsersRequestDTO,
  ): Promise<ReadUsersResponseDTO> {
    return await this.userService.getUsers(readUsersRequestDTO);
  }

  @ApiCookieAuth()
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
    @Body() updateUserRequestDTO: UpdateUserRequestDTO,
    @Param('username') username: string,
  ): Promise<UpdateUserResponseDTO> {
    return await this.userService.updateUser(username, updateUserRequestDTO);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @UserRoles('admin')
  @ApiResponse({
    status: 200,
    description: `Return the user`,
    type: ReadUserResponseDTO,
  })
  @Get('/:username')
  public async getUser(
    @Param('username') username: string,
  ): Promise<ReadUserResponseDTO> {
    return await this.userService.getUser({ username });
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @UserRoles('admin')
  @ApiResponse({
    status: 200,
    description: `Delete user`,
  })
  @Delete('/:username')
  public async deleteUser(
    @Param('username') username: string,
  ): Promise<SharedDeleteResponseDTO> {
    return await this.userService.deleteUser(username);
  }
}
