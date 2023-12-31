import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DbConfig {
  @IsOptional()
  database?: string;

  @IsString()
  host: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsNumber()
  port: number;

  @IsOptional()
  @IsString()
  user?: string;
}
