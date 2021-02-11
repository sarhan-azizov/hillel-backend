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
  GetUserResponseDTO,
  UserAuthorizationRequestDTO,
  UserAuthorizationResponseDTO,
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  UserChangePasswordRequestDTO,
  GetUserQueryDTO,
} from './dto';
import { SharedDeleteResponseDTO } from '../../shared/dto';

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
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<UserAuthorizationResponseDTO> {
    const token: UserAuthorizationResponseDTO = await this.userService.authorize(
      userAuthorizationRequestDTO,
    );
    const bearerToken = 'Bearer ' + token;

    response.cookie('Authorization', bearerToken);
    response.send({ token: bearerToken });

    return token;
  }

  @ApiCookieAuth()
  @Get('logout')
  public async logout(@Req() request: Request, @Res() response: Response) {
    const decodedToken = await getVerifiedToken(request);

    response.clearCookie('Authorization');

    response.send({
      status: 200,
      msg: `User ${decodedToken.username} was successfully logout`,
    });
  }

  @ApiCookieAuth()
  @ApiBody({
    type: UserChangePasswordRequestDTO,
  })
  @ApiResponse({
    status: 200,
    description: `Return  user with changed password`,
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
    type: GetUserResponseDTO,
  })
  @Post('/registration')
  public async registration(
    @Body() createUserRequestDTO: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return await this.userService.registration(createUserRequestDTO);
  }

  @ApiCookieAuth()
  @UserRoles('admin')
  @ApiQuery({ required: false, name: 'activated', type: 'boolean' })
  @ApiResponse({
    status: 200,
    description: `Return created users`,
    type: [GetUserResponseDTO],
  })
  @Get()
  public async getUsers(
    @Query() getUserQueryDTO: GetUserQueryDTO,
  ): Promise<Array<GetUserResponseDTO>> {
    return await this.userService.getUsers(getUserQueryDTO);
  }

  @ApiCookieAuth()
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
