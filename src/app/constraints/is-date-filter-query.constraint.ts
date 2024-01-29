import { plainToInstance } from 'class-transformer';
import {
  ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  isDateString,
  validate,
} from 'class-validator';

import { DateFilterQuery } from '../dto';

@ValidatorConstraint({ async: true, name: 'isDateFilterObject' })
export class IsDateFilterQueryConstraint
  implements ValidatorConstraintInterface
{
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} should be a valid ISO Date string or object`;
  }

  async validate(value: DateFilterQuery | string): Promise<boolean> {
    if (typeof value === 'string') {
      return isDateString(value);
    }
    const errors = await validate(plainToInstance(DateFilterQuery, value), {
      forbidNonWhitelisted: true,
      whitelist: true,
    });
    return !errors.length;
  }
}
