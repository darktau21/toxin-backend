import { ApiProperty } from '@nestjs/swagger';

export type PaginatedData<TData> = [results: TData[], info: PaginationInfo];

export class PaginationInfo {
  @ApiProperty({ description: 'Текущая страница', example: 1, type: Number })
  currentPage: number;

  @ApiProperty({ description: 'Последняя страница', type: Boolean })
  isLastPage: boolean;

  @ApiProperty({
    description: 'Общее кол-во страниц',
    example: 1,
    type: Number,
  })
  pagesCount: number;

  constructor(paginatedResponse: PaginationInfo) {
    Object.assign(this, paginatedResponse);
  }
}
