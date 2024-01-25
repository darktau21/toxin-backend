import { Types } from 'mongoose';

import { Genders } from './genders.enum';
import { Roles } from './roles.enum';

export interface IUser {
  _id: Types.ObjectId;

  birthday: Date | string;

  deletedAt?: Date | string;

  deletionDate?: Date | string;

  email: string;

  gender: Genders;

  isBlocked: boolean;

  isDeleted: boolean;

  isSubscriber: boolean;

  isVerified: boolean;

  lastName: string;

  name: string;

  password: string;

  role: Roles;
}
