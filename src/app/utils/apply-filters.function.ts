import { Query } from 'mongoose';

type FilterParams = {
  select?: string;
};

export function applyFilters(
  query: Query<unknown, unknown>,
  params: FilterParams,
) {
  if (params.select) {
    query.select(params.select);
  }
}
