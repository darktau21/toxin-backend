import { Exclude, Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';

import { Roles, User } from '~/user/schemas';

export class UserResponse {
  @Transform(({ value }) => value.toString())
  _id: mongoose.Types.ObjectId;

  @Expose({ groups: [Roles.ADMIN] })
  isBlocked: boolean;

  @Expose({ groups: [Roles.ADMIN] })
  isDeleted: boolean;

  @Exclude()
  password: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
