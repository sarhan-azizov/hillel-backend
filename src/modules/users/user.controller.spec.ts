import { Test } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { Request, Response } from 'express';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as tokenHelpers from '../../shared/helpers/token';

import {
  mockedUser,
  mockedAuthorizedUser,
  mockedAuthorizedToken,
  mockedAuthorizedResponse,
} from './mocks';

jest.mock('../../shared/helpers/token', () => ({
  getVerifiedToken: jest
    .fn()
    .mockResolvedValue({ username: 'Randy_Dietrich95' }),
  removeToken: jest.fn(),
}));

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = (): any => ({
    authorize: jest.fn().mockResolvedValue(mockedAuthorizedToken),
    changePassword: jest.fn().mockResolvedValue(mockedUser),
    registration: jest.fn(),
    createUser: jest.fn(),
    getUser: jest.fn(),
    getUsers: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: mockUserService,
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('authorization', () => {
    const { username, password } = mockedAuthorizedUser;
    const response: Response = mocks.createResponse();

    it(`Should return an authorized user token`, async () => {
      const spyOnResponseSend = jest.spyOn(response, 'send');

      await userController.authorization({ username, password }, response);

      expect(userService.authorize).toBeCalledTimes(1);
      expect(userService.authorize).toBeCalledWith({ username, password });
      expect(spyOnResponseSend).toBeCalledWith({
        token: mockedAuthorizedResponse,
      });
    });

    it(`Should return a token in an authorization header and cookie`, async () => {
      const spyOnResponseHeader = jest.spyOn(response, 'header');
      const spyOnResponseCookie = jest.spyOn(response, 'cookie');

      await userController.authorization({ username, password }, response);

      expect(spyOnResponseHeader).toBeCalledWith(
        'Authorization',
        mockedAuthorizedResponse,
      );
      expect(spyOnResponseCookie).toBeCalledWith(
        'Authorization',
        mockedAuthorizedResponse,
      );
    });
  });

  describe('logout', () => {
    const response: Response = mocks.createResponse();
    const request: Request = mocks.createRequest();
    const spyOnResponseSend = jest.spyOn(response, 'send');

    it('the user should be verified and logout', async () => {
      await userController.logout(request, response);

      expect(tokenHelpers.getVerifiedToken).toBeCalledWith(request);
      expect(tokenHelpers.removeToken).toBeCalledWith(response);
      expect(spyOnResponseSend).toBeCalledWith({
        status: 200,
        msg: `The User ${mockedUser.username} was successfully logout`,
      });
    });
  });

  describe('change password', () => {
    const response: Response = mocks.createResponse();
    const request: Request = mocks.createRequest();
    const spyOnResponseSend = jest.spyOn(response, 'send');

    it('should return user with changed password and logout', async () => {
      await userController.changePassword(request, response, {
        password: mockedUser.password,
      });

      expect(tokenHelpers.getVerifiedToken).toBeCalledWith(request);
      expect(userService.changePassword).toBeCalledWith(mockedUser.username, {
        password: mockedUser.password,
      });
      expect(tokenHelpers.removeToken).toBeCalledWith(response);
      expect(spyOnResponseSend).toBeCalledWith(mockedUser);
    });
  });
});
