import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class NumberFilterQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  gt?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  gte?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lt?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lte?: number;
}
