import { IsBoolean, IsInt, IsNumber, IsString } from 'class-validator';

export class MailerConfig {
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

  @IsNumber()
  @IsInt()
  confirmationTime: number;
}
