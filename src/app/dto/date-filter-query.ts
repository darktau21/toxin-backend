import { IsDateString, IsOptional } from 'class-validator';

export class DateFilterQuery {
  @IsOptional()
  @IsDateString()
  gt?: string;

  @IsOptional()
  @IsDateString()
  gte?: string;

  @IsOptional()
  @IsDateString()
  lt?: string;

  @IsOptional()
  @IsDateString()
  lte?: string;
}
