import { ValidationOptions, registerDecorator } from 'class-validator';

import { IsOldEmailDataExistsConstraint } from '../constraints';
import { OldEmailData } from '../schemas';

export function IsOldEmailDataExists(validationOptions?: ValidationOptions) {
  return function (
    object: Partial<OldEmailData>,
    propertyName: keyof OldEmailData,
  ) {
    registerDecorator({
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: IsOldEmailDataExistsConstraint,
    });
  };
}
