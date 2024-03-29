import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class DbConfigSchema {
  @IsOptional()
  database?: string;

  @IsString()
  host: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsNumber()
  @IsInt()
  port: number;

  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsString()
  replicaSet: string;
}
