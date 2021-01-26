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
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Response, Request } from 'express';

import { RolesGuard } from '../../shared/guards/authorization.guard';
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
    const logoutUsername = await this.userService.logout(request);

    response.clearCookie('Authorization');

    response.send({
      status: 200,
      msg: `User ${logoutUsername} was successfully logout`,
    });
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
  @ApiResponse({
    status: 200,
    description: `Return created users`,
    type: [GetUserResponseDTO],
  })
  @Get()
  public async getUsers(): Promise<Array<GetUserResponseDTO>> {
    return await this.userService.getUsers();
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
}
