import { Exclude, Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';

import { Genders, Roles, User } from '~/user/schemas';

@Exclude()
export class UserResponse {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.toString())
  _id: mongoose.Types.ObjectId;

  @Expose()
  birthday: string;

  @Expose()
  email: string;

  @Expose()
  gender: Genders;

  @Expose({ groups: [Roles.ADMIN] })
  isBlocked: boolean;

  @Expose()
  isDeleted: boolean;

  @Expose()
  isSubscriber: boolean;

  @Expose()
  isVerified: boolean;

  @Expose()
  lastName: string;

  @Expose()
  name: string;

  @Expose()
  role: Roles;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
