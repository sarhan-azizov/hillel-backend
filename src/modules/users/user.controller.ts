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

import {
  getVerifiedToken,
  RolesGuard,
} from '../../shared/guards/authorization.guard';
import { UserRoles } from '../../shared/decorators/roles.decorator';
import { UserService } from './user.service';

import {
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
  UserResponseDTO,
  UsersResponseDTO,
  UserAuthorizationRequestDTO,
  UserAuthorizationResponseDTO,
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  UserChangePasswordRequestDTO,
  UserQueryRequestDTO,
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
    description: `Return authorized user's token`,
    type: UserAuthorizationResponseDTO,
  })
  @Get('authorization')
  public async authorization(
    @Query() userAuthorizationRequestDTO: UserAuthorizationRequestDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<void> {
    const token: TokenType = await this.userService.authorize(
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
    description: `Remove the Authorization header and cookie`,
  })
  @Get('logout')
  public async logout(@Req() request: Request, @Res() response: Response) {
    const decodedToken = await getVerifiedToken(request);

    response.removeHeader('Authorization');
    response.clearCookie('Authorization');

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
  ): Promise<UpdateUserResponseDTO> {
    const decodedToken = await getVerifiedToken(request);
    const updatedUser = await this.userService.changePassword(
      decodedToken.username,
      userChangePasswordRequestDTO,
    );

    response.clearCookie('Authorization');
    response.send(updatedUser);

    return updatedUser;
  }

  @ApiBody({ type: CreateUserRequestDTO })
  @ApiResponse({
    status: 201,
    description: `Return registered user`,
    type: UserResponseDTO,
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
  @ApiResponse({
    status: 200,
    description: `Return created users`,
    type: [UserResponseDTO],
  })
  @Get()
  public async getUsers(
    @Query() userQueryRequestDTO: UserQueryRequestDTO,
  ): Promise<UsersResponseDTO> {
    return await this.userService.getUsers(userQueryRequestDTO);
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
    @Body() updateUserRequestDTO: Partial<UpdateUserRequestDTO>,
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
    type: UserResponseDTO,
  })
  @Get('/:username')
  public async getUser(
    @Param('username') username: string,
  ): Promise<UserResponseDTO> {
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
