import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { type Model, type Query } from 'mongoose';

import type { IUser } from '~/user/interfaces';

import { USER_SCHEMA_NAME } from '~/user/schemas';
import { UserService } from '~/user/user.service';

import type { IEmailConfirmationData } from './interfaces';

import { EmailService } from './email.service';
import { EMAIL_CONFIRMATION_DATA_SCHEMA_NAME, OldEmailData } from './schemas';

describe('EmailService', () => {
  let emailService: EmailService;
  let userService: UserService;
  let emailConfirmationDataModel: Model<IEmailConfirmationData>;
  let oldEmailDataModel: Model<OldEmailData>;
  let query: Query<any, any>;

  const CODE =
    'jg321fklsd4j23k35fgkdlirjgriosjf456kd567l576fj8g69irodsjgdjfslgj';
  const USER_ID = '6578b7e174334f130d4401f9';

  const mockEmailData = {
    newEmail: 'test@test.com',
  } as Partial<IEmailConfirmationData>;
  const mockOldEmailData = {
    email: 'test@test.com',
    userId: USER_ID,
  } as Partial<OldEmailData>;
  const mockUser = {
    email: 'test@test.com',
  } as IUser;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmailService,
        UserService,
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

    emailService = module.get(EmailService);
    emailConfirmationDataModel = module.get(
      getModelToken(EMAIL_CONFIRMATION_DATA_SCHEMA_NAME),
    );
    oldEmailDataModel = module.get(getModelToken(OldEmailData.name));
    userService = module.get(UserService);

    query = {
      exec: jest.fn(),
      lean: jest.fn().mockReturnThis(),
    } as unknown as Query<any, any>;

    jest
      .spyOn(emailConfirmationDataModel, 'findOneAndDelete')
      .mockReturnValue(query);
    jest.spyOn(emailConfirmationDataModel, 'exists').mockReturnValue(query);
    jest
      .spyOn(emailConfirmationDataModel, 'findOneAndUpdate')
      .mockReturnValue(query);
    jest.spyOn(emailConfirmationDataModel, 'findOne').mockReturnValue(query);
    jest.spyOn(oldEmailDataModel, 'exists').mockReturnValue(query);
    jest.spyOn(oldEmailDataModel, 'findOneAndDelete').mockReturnValue(query);
    jest.spyOn(oldEmailDataModel, 'findOne').mockReturnValue(query);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('confirm', () => {
    it('should return email confirmation data', async () => {
      jest.spyOn(query, 'exec').mockResolvedValue(mockEmailData);

      const result = await emailService.confirm(CODE, USER_ID);

      expect(result).toEqual(mockEmailData);
    });

    it('should return null if confirmation data not found', async () => {
      jest.spyOn(query, 'exec').mockResolvedValue(null);

      const result = await emailService.confirm(CODE, USER_ID);

      expect(result).toBeNull();
    });
  });

  describe('isConfirmationDataExists', () => {
    it('should return boolean', async () => {
      jest.spyOn(query, 'exec').mockResolvedValue(null);

      const result = await emailService.isConfirmationDataExists(
        'prop',
        'test',
      );

      expect(result).toBe(false);
    });
  });

  describe('isOldDataExists', () => {
    it('should return boolean', async () => {
      jest.spyOn(query, 'exec').mockResolvedValue(null);

      const result = await emailService.isOldDataExists('prop', 'test');

      expect(result).toBe(false);
    });
  });

  describe('restore', () => {
    it('should return updated email', async () => {
      jest.spyOn(query, 'exec').mockResolvedValue(mockEmailData);
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userService, 'update').mockResolvedValueOnce(mockUser);

      const result = await emailService.restore(CODE, USER_ID);

      expect(result).toEqual(mockEmailData);
    });

    it('should return null if email data not found', async () => {
      jest.spyOn(query, 'exec').mockResolvedValue(null);

      const result = await emailService.restore(CODE, USER_ID);

      expect(result).toBeNull();
    });

    it('should return null if user found', async () => {
      jest.spyOn(query, 'exec').mockResolvedValue(mockEmailData);
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await emailService.restore(CODE, USER_ID);

      expect(result).toBeNull();
    });
  });

  describe('saveOld', () => {
    it('should create new document', async () => {
      jest
        .spyOn(oldEmailDataModel, 'create')
        // @ts-expect-error returns wrong type
        .mockResolvedValueOnce([mockOldEmailData]);

      const result = await emailService.saveOld(mockUser.email, USER_ID);

      expect(result).toEqual(mockOldEmailData);
    });

    it('should return existing document', async () => {
      jest.spyOn(query, 'exec').mockResolvedValue(mockOldEmailData);

      const result = await emailService.saveOld(mockUser.email, USER_ID);

      expect(result).toEqual(mockOldEmailData);
    });
  });

  describe('update', () => {
    it('should create email confirmation', async () => {
      jest.spyOn(query, 'exec').mockResolvedValue(mockEmailData);

      const result = await emailService.update(mockUser.email, USER_ID);

      expect(result).toEqual(mockEmailData);
    });

    it('should return existing document', async () => {
      jest
        .spyOn(query, 'exec')
        .mockResolvedValue({ ...mockEmailData, userId: USER_ID });

      const result = await emailService.update(mockUser.email, USER_ID);

      expect(result).toEqual({ ...mockEmailData, userId: USER_ID });
    });
  });
});
