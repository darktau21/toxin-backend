import { ValidationOptions, registerDecorator } from 'class-validator';

import { IsUniqueUserFieldConstraint } from '../constraints';
import { IUser } from '../interfaces';

export function IsUniqueUserField(validationOptions?: ValidationOptions) {
  return function (object: Partial<IUser>, propertyName: keyof IUser) {
    registerDecorator({
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: IsUniqueUserFieldConstraint,
    });
  };
}
