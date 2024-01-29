import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max } from 'class-validator';

export abstract class PaginatedQueryDto {
  @IsOptional()
  @IsNumber()
  @Max(40)
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Количество результатов' })
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Номер страницы' })
  page?: number;
}
