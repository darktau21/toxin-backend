export type UnionFromTuple<TTuple extends Record<number, unknown>> =
  TTuple[number];
