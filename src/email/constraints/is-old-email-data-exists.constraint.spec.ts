import type { ValidationArguments } from 'class-validator';
import type { Model } from 'mongoose';

import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import type { IUser } from '~/user/interfaces';

import { USER_SCHEMA_NAME } from '~/user/schemas';
import { UserService } from '~/user/user.service';

import type { IEmailConfirmationData } from '../interfaces';

import { EmailService } from '../email.service';
import { EMAIL_CONFIRMATION_DATA_SCHEMA_NAME, OldEmailData } from '../schemas';
import { IsOldEmailDataExistsConstraint } from './is-old-email-data-exists.constraint';

describe('IsOldEmailDataExistsConstraint', () => {
  let isOldEmailDataExistsConstraint: IsOldEmailDataExistsConstraint;
  let emailService: EmailService;

  const mockValidationArguments = { property: 'test' } as ValidationArguments;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsOldEmailDataExistsConstraint,
        EmailService,
        UserService,
        {
          provide: getModelToken(OldEmailData.name),
          useValue: createMock<Model<OldEmailData>>(),
        },
        {
          provide: getModelToken(USER_SCHEMA_NAME),
          useValue: createMock<Model<IUser>>(),
        },
        {
          provide: getModelToken(EMAIL_CONFIRMATION_DATA_SCHEMA_NAME),
          useValue: createMock<Model<IEmailConfirmationData>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    isOldEmailDataExistsConstraint = module.get(IsOldEmailDataExistsConstraint);
    emailService = module.get(EmailService);
  });

  it('should be defined', () => {
    expect(isOldEmailDataExistsConstraint).toBeDefined();
  });

  describe('defaultMessage', () => {
    it('should return message with provided property', () => {
      const result = isOldEmailDataExistsConstraint.defaultMessage(
        mockValidationArguments,
      );

      expect(result).toMatch('test');
    });
  });

  describe('validate', () => {
    it('should return true if old email data exists', async () => {
      jest.spyOn(emailService, 'isOldDataExists').mockResolvedValue(true);

      const result = await isOldEmailDataExistsConstraint.validate(
        'test',
        mockValidationArguments,
      );

      expect(result).toBeTruthy();
    });

    it('should return false if old email data not exists', async () => {
      jest.spyOn(emailService, 'isOldDataExists').mockResolvedValue(false);

      const result = await isOldEmailDataExistsConstraint.validate(
        'test',
        mockValidationArguments,
      );

      expect(result).toBeFalsy();
    });
  });
});
