import { ValidationOptions, registerDecorator } from 'class-validator';

import { IsUniqueUserFieldConstraint } from '../constraints';
import { IUser } from '../interfaces';

export function IsUniqueUserField(
  fieldName?: keyof IUser,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      constraints: [fieldName],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: IsUniqueUserFieldConstraint,
    });
  };
}
