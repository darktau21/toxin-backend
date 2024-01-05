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

import { TokensConfigSchema } from './tokens-config.schema';

export class SecurityConfigSchema {
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
  tokens: TokensConfigSchema;
}
