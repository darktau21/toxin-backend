import {
  Exclude,
  Expose,
  Transform,
  TransformFnParams,
} from 'class-transformer';
import { formatISO } from 'date-fns';
import mongoose from 'mongoose';

import { Genders, IUser, Roles } from '~/user/interfaces';

function hideDeleted(
  arg: ((params: TransformFnParams) => unknown) | TransformFnParams,
) {
  if (typeof arg !== 'function') {
    return arg.obj.isDeleted ? undefined : arg.value;
  }

  return function (params: Parameters<typeof arg>[0]) {
    if (params.obj.isDeleted) {
      return undefined;
    }

    return arg(params);
  };
}

function exposeDeleted({ obj, value }: TransformFnParams) {
  return obj.isDeleted ? value : undefined;
}

@Exclude()
export class UserResponse {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.toString())
  _id?: mongoose.Types.ObjectId;

  @Expose()
  @Transform(
    hideDeleted(({ value }: { obj: IUser; value: Date }) =>
      formatISO(value, { representation: 'date' }),
    ),
  )
  birthday: Date;

  @Expose()
  @Transform(exposeDeleted)
  deletedAt: boolean;

  @Expose()
  @Transform(exposeDeleted)
  deletionDate: boolean;

  @Expose()
  @Transform(hideDeleted)
  email: string;

  @Expose()
  @Transform(hideDeleted)
  gender: Genders;

  @Expose({ groups: [Roles.ADMIN] })
  isBlocked: boolean;

  @Expose()
  @Transform(exposeDeleted)
  isDeleted: boolean;

  @Expose()
  @Transform(hideDeleted)
  isSubscriber: boolean;

  @Expose()
  @Transform(hideDeleted)
  isVerified: boolean;

  @Expose()
  @Transform(hideDeleted)
  lastName: string;

  @Expose()
  @Transform(hideDeleted)
  name: string;

  @Expose()
  @Transform(hideDeleted)
  role: Roles;

  constructor(user: Partial<IUser>) {
    Object.assign(this, user);
  }
}
