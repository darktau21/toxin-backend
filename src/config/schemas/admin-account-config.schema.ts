import { IsEmail, IsStrongPassword, MaxLength } from 'class-validator';

export class AdminAccountConfigSchema {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 1,
  })
  @MaxLength(32)
  password: string;
}
