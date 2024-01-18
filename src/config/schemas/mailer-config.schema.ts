import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class MailerConfigSchema {
  @IsString()
  host: string;

  @IsString()
  password: string;

  @IsNumber()
  @IsInt()
  port: number;

  @IsString()
  user: string;

  @IsBoolean()
  secure: boolean;

  @IsString()
  @MaxLength(48)
  name: string;

  @IsString()
  @MaxLength(128)
  baseUrl: string;

  @IsString()
  @MaxLength(128)
  confirmEmailUrl: string;

  @IsString()
  @MaxLength(128)
  resetPasswordUrl: string;
}
