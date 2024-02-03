import { ValidationOptions, registerDecorator } from 'class-validator';

import { IsUniqueEmailDataConstraint } from '../constraints';
import { IEmailConfirmationData } from '../interfaces';

export function IsUniqueNewEmailData(validationOptions?: ValidationOptions) {
  return function (
    object: Partial<IEmailConfirmationData>,
    propertyName: keyof IEmailConfirmationData,
  ) {
    registerDecorator({
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: IsUniqueEmailDataConstraint,
    });
  };
}
