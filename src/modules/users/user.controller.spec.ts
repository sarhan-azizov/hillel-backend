import { Test } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { Request, Response } from 'express';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as tokenHelpers from '../../shared/helpers/token';

import {
  mockedUserRequest,
  mockedUserResponse,
  mockedAuthorizedUser,
  mockedAuthorizedToken,
  mockedAuthorizedResponse,
  mockedUsersResponse,
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
    changePassword: jest.fn().mockResolvedValue(mockedUserResponse),
    registration: jest.fn().mockResolvedValue(mockedUserResponse),
    createUser: jest.fn(),
    getUser: jest.fn().mockResolvedValue(mockedUserResponse),
    getUsers: jest.fn().mockResolvedValue(mockedUsersResponse),
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
        msg: `The User ${mockedUserResponse.username} was successfully logout`,
      });
    });
  });

  describe('change password', () => {
    const response: Response = mocks.createResponse();
    const request: Request = mocks.createRequest();
    const spyOnResponseSend = jest.spyOn(response, 'send');

    it('should return user with changed password and logout', async () => {
      await userController.changePassword(request, response, {
        password: mockedUserResponse.password,
      });

      expect(tokenHelpers.getVerifiedToken).toBeCalledWith(request);
      expect(userService.changePassword).toBeCalledWith(
        mockedUserResponse.username,
        {
          password: mockedUserResponse.password,
        },
      );
      expect(tokenHelpers.removeToken).toBeCalledWith(response);
      expect(spyOnResponseSend).toBeCalledWith(mockedUserResponse);
    });
  });

  describe('registration', () => {
    it('should return a registered user', async () => {
      const registeredUser = await userController.registration(
        mockedUserRequest,
      );

      expect(userService.registration).toBeCalledWith(mockedUserRequest);
      expect(registeredUser).toEqual(mockedUserResponse);
    });
  });

  describe('getUsers', () => {
    it('should return users', async () => {
      const users = await userController.getUsers(undefined);

      expect(userService.getUsers).toBeCalledWith(undefined);
      expect(users).toEqual(mockedUsersResponse);
    });

    it('should return activated users', async () => {
      const users = await userController.getUsers({ activated: true });

      expect(userService.getUsers).toBeCalledWith({ activated: true });
      expect(users).toEqual(mockedUsersResponse);
    });

    it('should return not activated users', async () => {
      const users = await userController.getUsers({ activated: false });

      expect(userService.getUsers).toBeCalledWith({ activated: false });
      expect(users).toEqual(mockedUsersResponse);
    });

    it('should return users on the 7 page and by 5 per page ', async () => {
      const users = await userController.getUsers({ size: 5, page: 7 });

      expect(userService.getUsers).toBeCalledWith({ size: 5, page: 7 });
      expect(users).toEqual(mockedUsersResponse);
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const username = mockedUserRequest.username;
      const user = await userController.getUser(username);

      expect(userService.getUser).toBeCalledWith({ username });
      expect(user).toEqual(mockedUserResponse);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const username = mockedUserRequest.username;
      const deletedUserResponse = await userController.deleteUser(username);

      expect(userService.deleteUser).toBeCalledWith(username);
      expect(deletedUserResponse).toEqual({
        status: 200,
        msg: `the username "${username}" succeed deleted`,
      });
    });
  });
});
