import { Test } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { Response } from 'express';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import {
  mockedAuthorizedUser,
  mockedAuthorizedToken,
  mockedAuthorizedResponse,
  mockedRegisterUserRequest,
  mockedRegisterUserResponse,
} from './mocks';

describe('UserController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = (): any => ({
    authorize: jest.fn().mockResolvedValue(mockedAuthorizedToken),
    registration: jest.fn().mockResolvedValue(mockedRegisterUserResponse),
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: mockAuthService,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('authorization', () => {
    const { username, password } = mockedAuthorizedUser;
    const response: Response = mocks.createResponse();

    it(`Should return an authorized user token`, async () => {
      const spyOnResponseSend = jest.spyOn(response, 'send');

      await authController.authorization({ username, password }, response);

      expect(authService.authorize).toBeCalledTimes(1);
      expect(authService.authorize).toBeCalledWith({ username, password });
      expect(spyOnResponseSend).toBeCalledWith({
        token: mockedAuthorizedResponse,
      });
    });

    it(`Should return a token in an authorization header and cookie`, async () => {
      const spyOnResponseHeader = jest.spyOn(response, 'header');
      const spyOnResponseCookie = jest.spyOn(response, 'cookie');

      await authController.authorization({ username, password }, response);

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

  describe('registration', () => {
    it('should return a registered user', async () => {
      const registeredUser = await authController.registration(
        mockedRegisterUserRequest,
      );

      expect(authService.registration).toBeCalledWith(
        mockedRegisterUserRequest,
      );
      expect(registeredUser).toEqual(mockedRegisterUserResponse);
    });
  });
});
