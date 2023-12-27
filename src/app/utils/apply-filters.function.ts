import { Query } from 'mongoose';

type FilterParams<TSort extends string> = {
  select?: string;
  sort?: TSort;
};

export function applyFilters<TSort extends string>(
  query: Query<unknown, unknown>,
  params: FilterParams<TSort>,
) {
  if (params.sort) {
    query.sort(params.sort);
  }

  if (params.select) {
    query.select(params.select);
  }
}
