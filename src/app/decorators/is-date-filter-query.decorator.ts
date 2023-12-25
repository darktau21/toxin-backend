import { type ValidationOptions, registerDecorator } from 'class-validator';

import { IsDateFilterQueryConstraint } from '~/app/constraints';

export function IsDateFilterObject<T extends object>(
  validationOptions?: ValidationOptions,
) {
  return function (object: T, propertyName: string) {
    registerDecorator({
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: IsDateFilterQueryConstraint,
    });
  };
}
