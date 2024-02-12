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
import { IsUniqueEmailDataConstraint } from './is-unique-email-data.constraint';

describe('IsUniqueEmailDataConstraint', () => {
  let isUniqueEmailDataConstraint: IsUniqueEmailDataConstraint;
  let emailService: EmailService;

  const mockValidationArguments = { property: 'test' } as ValidationArguments;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsUniqueEmailDataConstraint,
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

    isUniqueEmailDataConstraint = module.get(IsUniqueEmailDataConstraint);
    emailService = module.get(EmailService);
  });

  it('should be defined', () => {
    expect(isUniqueEmailDataConstraint).toBeDefined();
  });

  describe('defaultMessage', () => {
    it('should return message with provided property', () => {
      const result = isUniqueEmailDataConstraint.defaultMessage(
        mockValidationArguments,
      );

      expect(result).toMatch('test');
    });
  });

  describe('validate', () => {
    it('should return true if email data unique', async () => {
      jest
        .spyOn(emailService, 'isConfirmationDataExists')
        .mockResolvedValue(false);

      const result = await isUniqueEmailDataConstraint.validate(
        'test',
        mockValidationArguments,
      );

      expect(result).toBeTruthy();
    });

    it('should return false if email data not unique', async () => {
      jest
        .spyOn(emailService, 'isConfirmationDataExists')
        .mockResolvedValue(true);

      const result = await isUniqueEmailDataConstraint.validate(
        'test',
        mockValidationArguments,
      );

      expect(result).toBeFalsy();
    });
  });
});
