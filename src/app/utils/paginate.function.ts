import { Query } from 'mongoose';

type PaginateParams = {
  documentsCount?: number;
  limit?: number;
  page?: number;
};

export function paginate(
  query: Query<unknown, unknown>,
  { documentsCount, limit = 10, page = 1 }: PaginateParams,
) {
  const pagesCount = Math.ceil(documentsCount / limit);
  const skip = limit * (page - 1);
  const isLastPage = page >= pagesCount;

  query.limit(limit).skip(skip);
  return { currentPage: page, isLastPage, pagesCount };
}

export type PaginatedResponse = ReturnType<typeof paginate>;
