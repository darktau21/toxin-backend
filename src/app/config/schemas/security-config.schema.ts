import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { TokensConfig } from './tokens-config.schema';

export class SecurityConfig {
  @IsString()
  @MinLength(8)
  cookieSecret: string;

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(16)
  passwordHashRounds: number;

  @IsBoolean()
  secureCookie: boolean;

  @ValidateNested()
  tokens: TokensConfig;
}
