import { IsInt, IsNumber, Min } from 'class-validator';

export class RequestsConfigSchema {
  @IsNumber()
  @Min(0)
  @IsInt()
  cacheTtl: number;

  @IsNumber()
  @Min(0)
  @IsInt()
  limit: number;

  @IsNumber()
  @Min(0)
  @IsInt()
  throttle: number;
}
