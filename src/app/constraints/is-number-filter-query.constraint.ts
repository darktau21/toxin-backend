import { plainToInstance } from 'class-transformer';
import {
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  isNumberString,
  validate,
} from 'class-validator';

import { NumberFilterQuery } from '../dto';

@ValidatorConstraint({ async: true, name: 'isNumberFilterObject' })
export class IsNumberFilterQueryConstraint
  implements ValidatorConstraintInterface
{
  async validate(value: NumberFilterQuery | number): Promise<boolean> {
    if (typeof value === 'string') {
      return isNumberString(value);
    }
    const errors = await validate(plainToInstance(NumberFilterQuery, value), {
      forbidNonWhitelisted: true,
      whitelist: true,
    });
    return !errors.length;
  }
}
