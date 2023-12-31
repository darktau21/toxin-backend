import { IsInt, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class TokensConfig {
  @IsNumber()
  @IsInt()
  @Min(10)
  accessExpTime: number;

  @IsString()
  @MinLength(8)
  accessSecret: string;

  @IsNumber()
  @IsInt()
  @Min(10)
  refreshExpTime: number;
}
