import { ValidationOptions, registerDecorator } from 'class-validator';

import { IsUniqueUserFieldConstraint } from '~/user/constraints';
import { IUser } from '~/user/interfaces';

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
