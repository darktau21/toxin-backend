import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class S3ConfigSchema {
  @IsString()
  region: string;

  @IsString()
  accessKeyId: string;

  @IsString()
  secretAccessKey: string;

  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsBoolean()
  forcePathStyle: boolean;

  @IsBoolean()
  lookup: boolean;

  @IsBoolean()
  ssl: boolean;
}
