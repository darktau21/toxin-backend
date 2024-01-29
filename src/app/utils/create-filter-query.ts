import { DateFilterQuery, NumberFilterQuery } from '../dto';

export function createFilterQuery(
  query?: DateFilterQuery | NumberFilterQuery | number | string,
) {
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
