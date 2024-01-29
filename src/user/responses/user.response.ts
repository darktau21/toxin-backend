import { Exclude, Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';

import { excludeDeleted, exposeDeleted } from '~/app/utils';
import { Genders, IUser, Roles } from '../interfaces';
export const USER_RESPONSE_FIELD_NAME = 'user';
export const USERS_RESPONSE_FIELD_NAME = 'users';

@Exclude()
export class UserResponse implements Partial<IUser> {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.toString())
  @Expose()
  createdAt?: Date;

  @Expose()
  @Transform(exposeDeleted)
  deletedAt: string;

  @Expose()
  @Transform(exposeDeleted)
  deletionDate: string;

  @Expose()
  @Transform(excludeDeleted)
  gender: Genders;

  @Expose()
  @Transform(exposeDeleted)
  isDeleted: boolean;

  @Expose()
  @Transform(excludeDeleted)
  isVerified: boolean;

  @Expose()
  @Transform(excludeDeleted)
  lastName: string;

  @Expose()
  @Transform(excludeDeleted)
  name: string;

  @Expose()
  @Transform(excludeDeleted)
  role: Roles;

  constructor(user: Partial<IUser>) {
    Object.assign(this, user);
  }
}
