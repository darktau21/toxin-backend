import { FilterObjectDate, FilterObjectNumber } from '~/app/constraints';

export function createFilterQuery(
  query?: FilterObjectDate | FilterObjectNumber | number | string,
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
