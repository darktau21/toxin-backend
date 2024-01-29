import { type ValidationOptions, registerDecorator } from 'class-validator';

import { IsNumberFilterQueryConstraint } from '../constraints';

export function IsNumberFilterQuery<T extends object>(
  validationOptions?: ValidationOptions,
) {
  return function (object: T, propertyName: string) {
    registerDecorator({
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: IsNumberFilterQueryConstraint,
    });
  };
}
