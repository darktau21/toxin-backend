import { ClassConstructor } from 'class-transformer';

export function getClassPropertyNames(constructor: ClassConstructor<unknown>) {
  const obj = new constructor();
  return Object.getOwnPropertyNames(obj).filter(
    (property) => property !== '_id',
  );
}
