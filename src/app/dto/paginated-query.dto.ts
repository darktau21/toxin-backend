import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export abstract class PaginatedQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(40)
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Количество результатов' })
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Номер страницы' })
  page?: number;
}
