import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import {
  type ClientSession,
  type Connection,
  type Model,
  Types,
} from 'mongoose';

import type { IUser } from '~/user/interfaces';

import { HttpException } from '~/app/exceptions';
import { mailProviders } from '~/mail/mail.providers';
import { MailService } from '~/mail/mail.service';
import { USER_SCHEMA_NAME } from '~/user/schemas';
import { UserService } from '~/user/user.service';

import type { IEmailConfirmationData } from './interfaces';

import { IsUniqueEmailDataConstraint } from './constraints';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EMAIL_CONFIRMATION_DATA_SCHEMA_NAME, OldEmailData } from './schemas';

describe('EmailController', () => {
  let emailController: EmailController;
  let emailService: EmailService;

  const CODE =
    'jg321fklsd4j23k35fgkdlirjgriosjf456kd567l576fj8g69irodsjgdjfslgj';

  const mockEmailData = {
    _id: new Types.ObjectId('6578b7e174334f130d4401f9'),
    code: CODE,
    createdAt: new Date('2000-10-10'),
    newEmail: 'test@test.com',
    userId: '6578b7e174334f130d4401f9',
  } as IEmailConfirmationData;
  const mockOldEmailData = {
    email: 'test@test.com',
  } as OldEmailData;
  const mockUser = {
    _id: new Types.ObjectId('6578b7e174334f130d4401f9'),
    email: 'test@test.com',
  } as IUser;
  const mockSession = createMock<ClientSession>();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        EmailService,
        IsUniqueEmailDataConstraint,
        UserService,
        ...mailProviders,
        {
          provide: MailService,
          useValue: createMock<MailService>(),
        },
        {
          provide: 'DatabaseConnection',
          useValue: createMock<Connection>(),
        },
        {
          provide: getModelToken(USER_SCHEMA_NAME),
          useValue: createMock<Model<IUser>>(),
        },
        {
          provide: getModelToken(EMAIL_CONFIRMATION_DATA_SCHEMA_NAME),
          useValue: createMock<Model<IEmailConfirmationData>>(),
        },
        {
          provide: getModelToken(OldEmailData.name),
          useValue: createMock<Model<OldEmailData>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    emailController = module.get(EmailController);
    emailService = module.get(EmailService);
  });

  it('should be defined', () => {
    expect(emailController).toBeDefined();
  });

  describe('confirm', () => {
    it('should return confirmation data', async () => {
      jest.spyOn(emailService, 'confirm').mockResolvedValueOnce(mockEmailData);

      const result = await emailController.confirm(mockUser, CODE, mockSession);

      expect(result).toEqual(mockEmailData);
    });

    it('should throw http exception', async () => {
      jest.spyOn(emailService, 'confirm').mockResolvedValueOnce(null);

      expect(
        emailController.confirm(mockUser, CODE, mockSession),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('restore', () => {
    it('should return restore data', async () => {
      jest.spyOn(emailService, 'restore').mockResolvedValueOnce(mockEmailData);

      const result = await emailController.restore(mockUser, CODE, mockSession);

      expect(result).toEqual(mockEmailData);
    });

    it('should throw http exception', async () => {
      jest.spyOn(emailService, 'restore').mockResolvedValueOnce(null);

      expect(
        emailController.restore(mockUser, CODE, mockSession),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should return confirmation data', async () => {
      jest.spyOn(emailService, 'update').mockResolvedValueOnce(mockEmailData);
      jest
        .spyOn(emailService, 'saveOld')
        .mockResolvedValueOnce(mockOldEmailData);

      const result = await emailController.update(
        mockUser,
        { newEmail: 'test@test.com' },
        mockSession,
      );

      expect(result).toEqual({
        newEmail: mockEmailData.newEmail,
        oldEmail: mockOldEmailData.email,
      });
    });
  });
});
