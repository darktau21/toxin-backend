import type { FilterObject } from '~/app/types';

export function createFilterQuery<T>(query?: FilterObject<T>) {
  if (!query) return;

  let result = query;
  if (typeof query !== 'string') {
    result = JSON.parse(
      JSON.stringify(query)?.replace(
        /\b(lte|lt|gte|gt)/g,
        (substr) => `$${substr}`,
      ),
    );
  }

  return result;
}
