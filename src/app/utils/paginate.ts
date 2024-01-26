import { Query } from 'mongoose';

type PaginateParams<TSort extends string = string> = {
  documentsCount?: number;
  limit?: number;
  page?: number;
  sort?: TSort;
};

export function paginate<TSort extends string = string>(
  query: Query<unknown, unknown>,
  { documentsCount, limit = 10, page = 1, sort }: PaginateParams<TSort>,
) {
  const pagesCount = Math.ceil(documentsCount / limit);
  const skip = limit * (page - 1);
  const isLastPage = page >= pagesCount;

  if (sort) {
    query.sort(sort);
  }

  query.limit(limit).skip(skip);
  return { currentPage: page, isLastPage, pagesCount };
}

export type PaginatedResponse<T> = [
  result: T[],
  pagesInfo: ReturnType<typeof paginate>,
];
