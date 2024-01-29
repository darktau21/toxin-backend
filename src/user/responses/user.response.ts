import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';

import { excludeDeleted, exposeDeleted } from '~/app/utils';

import { Genders, IUser, Roles } from '../interfaces';

export const USER_RESPONSE_FIELD_NAME = 'user';
export const USERS_RESPONSE_FIELD_NAME = 'users';

@Exclude()
export class UserResponse implements Partial<IUser> {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.toString())
  @ApiPropertyOptional({
    name: 'id',
    type: String,
  })
  _id?: Types.ObjectId;

  @Expose()
  @Transform(excludeDeleted)
  @ApiPropertyOptional({ description: 'Дата рождения', type: String })
  birthday?: Date;

  @Expose()
  @ApiPropertyOptional({ description: 'Дата создания аккаунта', type: String })
  createdAt?: Date;

  @Expose()
  @Transform(exposeDeleted)
  @ApiPropertyOptional({ description: 'Дата удаления', type: String })
  deletedAt?: string;

  @Expose()
  @Transform(exposeDeleted)
  @ApiPropertyOptional({
    description: 'Дата удаления без возможности восстановления',
    type: String,
  })
  deletionDate?: string;

  @Expose()
  @Transform(excludeDeleted)
  @ApiPropertyOptional({
    description: 'Пол',
    enum: Genders,
    enumName: 'Genders',
    type: String,
  })
  gender?: Genders;

  @Expose()
  @Transform(excludeDeleted)
  @ApiPropertyOptional({ description: 'Аккаунт заблокирован', type: Boolean })
  isBlocked?: boolean;

  @Expose()
  @Transform(exposeDeleted)
  @ApiPropertyOptional({ description: 'Аккаунт удален', type: Boolean })
  isDeleted?: boolean;

  @Expose()
  @Transform(excludeDeleted)
  @ApiPropertyOptional({ description: 'Аккаунт подтвержден', type: Boolean })
  isVerified?: boolean;

  @Expose()
  @Transform(excludeDeleted)
  @ApiPropertyOptional({ description: 'Фамилия', type: String })
  lastName?: string;

  @Expose()
  @Transform(excludeDeleted)
  @ApiPropertyOptional({ description: 'Имя', type: String })
  name?: string;

  @Expose()
  @Transform(excludeDeleted)
  @ApiPropertyOptional({
    description: 'Роль',
    enum: Roles,
    enumName: 'Roles',
    type: String,
  })
  role?: Roles;

  constructor(user: Partial<IUser>) {
    Object.assign(this, user);
  }
}
