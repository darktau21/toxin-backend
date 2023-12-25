import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import type { FilterObject } from '~/app/types';

import { IsDateFilterObject } from '~/app/decorators';
import { Genders } from '~/user/schemas';

enum UserSortFields {
  BIRTHDAY = 'birthday',
  CREATED_AT = 'createdAt',
  REVERSE_BIRTHDAY = '-birthday',
  REVERSE_CREATED_AT = '-createdAt',
}

export class SortUsersQueryDto {
  @IsOptional()
  @IsDateFilterObject()
  birthday?: FilterObject<string>;

  @IsOptional()
  @IsDateFilterObject()
  createdAt?: FilterObject<string>;

  @IsOptional()
  @IsString()
  @IsEnum(Genders)
  gender?: Genders;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @IsOptional()
  @IsBoolean()
  isSubscriber?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  name?: string;

  @IsOptional()
  @IsEnum(UserSortFields)
  sort?: UserSortFields;
}
