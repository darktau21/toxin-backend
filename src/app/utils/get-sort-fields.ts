export type SortFields<
  T extends object,
  K extends Exclude<keyof T, symbol>,
> = `${'' | '-'}${K}`;

export function getSortStrings<T extends object>(
  select: readonly Exclude<keyof T, symbol>[],
) {
  return [...select, ...select.map((property) => `-${property}`)];
}
