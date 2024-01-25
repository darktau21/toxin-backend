import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsUniqueUserField } from '~/user/decorators';
import { Genders, Roles } from '~/user/interfaces';

export class CreateUserDto {
  @ApiProperty({
    description: 'Дата рождения пользователя в формате "ГГГГ-ММ-ДД"',
    type: String,
  })
  @IsDateString()
  birthday: string;

  @ApiProperty({
    description: 'Валидный email адрес',
    type: String,
  })
  @IsEmail()
  @IsUniqueUserField()
  email: string;

  @ApiProperty({
    description: 'Пол - мужской или женский',
    enum: Genders,
    enumName: 'Genders',
  })
  @IsString()
  @IsEnum(Genders)
  gender: Genders;

  @ApiPropertyOptional({
    description: 'Является ли пользователь получателем рассылки',
    type: Boolean,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isSubscriber?: boolean;

  @ApiProperty({
    description: 'Фамилия, минимальная длинна - 2, максимальная - 32',
    type: String,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  lastName: string;

  @ApiProperty({
    description: 'Имя, минимальная длинна - 2, максимальная - 32',
    type: String,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  name: string;

  @ApiProperty({
    description:
      'Пароль, минимальная длинна - 8, максимальная - 32, должен содержать минимум 1 заглавную букву, 1 строчную букву и одну цифру',
    type: String,
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 1,
  })
  @MaxLength(32)
  password: string;

  @ApiPropertyOptional({
    description: 'Роль',
    enum: Roles,
    enumName: 'Roles',
  })
  @IsString()
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;
}
