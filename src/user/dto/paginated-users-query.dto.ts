import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsDateFilterQuery } from '~/app/decorators';
import { DateFilterQuery, PaginatedQueryDto } from '~/app/dto';
import {
  SortFields,
  UnionFromTuple,
  getClassPropertyNames,
  getSortStrings as getSortFields,
} from '~/app/utils';

import { Genders } from '../interfaces';
import { UserResponse } from '../responses';

const USER_SELECT_FIELDS = getClassPropertyNames(UserResponse);
const USER_SORT_FIELDS = [
  'createdAt',
  'deletedAt',
  'deletionDate',
  'birthday',
] as const;
const PREFIXED_SORT_FIELDS = getSortFields<UserResponse>(USER_SORT_FIELDS);

export type UserSortFields = SortFields<
  UserResponse,
  UnionFromTuple<typeof USER_SORT_FIELDS>
>;

export class SortUsersQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsDateFilterQuery()
  @ApiPropertyOptional({
    description: 'Дата рождения в формате ГГГГ-ММ-ДД',
    type: String,
  })
  birthday?: DateFilterQuery | string;

  @IsOptional()
  @IsDateFilterQuery()
  @ApiPropertyOptional({ description: 'Дата создания', type: String })
  createdAt?: DateFilterQuery | string;

  @IsOptional()
  @IsDateFilterQuery()
  @ApiPropertyOptional({ description: 'Дата удаления', type: String })
  deletedAt?: DateFilterQuery | string;

  @IsOptional()
  @IsDateFilterQuery()
  @ApiPropertyOptional({
    description: 'Дата удаления без возможности восстановления',
    type: String,
  })
  deletionDate?: DateFilterQuery | string;

  @IsOptional()
  @IsString()
  @IsEnum(Genders)
  @ApiPropertyOptional({
    description: 'Пол',
    enum: Genders,
    enumName: 'Genders',
  })
  gender?: Genders;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Пользователь заблокирован',
    type: Boolean,
  })
  isBlocked?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @ApiPropertyOptional({ description: 'Фамилия', type: String })
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @ApiPropertyOptional({ description: 'Имя', type: String })
  name?: string;

  @IsOptional()
  @IsIn(USER_SELECT_FIELDS)
  @Type(() => String)
  @ApiPropertyOptional({
    description: 'Поля, которые можно выбрать',
    enum: USER_SELECT_FIELDS,
    enumName: 'UserSelectFields',
    type: String,
  })
  select?: keyof UserResponse;

  @IsOptional()
  @IsIn(PREFIXED_SORT_FIELDS)
  @Type(() => String)
  @ApiPropertyOptional({
    description: 'Сортировка по',
    enum: PREFIXED_SORT_FIELDS,
    enumName: 'UserSortFields',
    type: String,
  })
  sort?: UserSortFields;
}
