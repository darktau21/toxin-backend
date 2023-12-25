import { plainToInstance } from 'class-transformer';
import {
  IsNumberString,
  IsOptional,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  isNumberString,
  validate,
} from 'class-validator';

import type { FilterObject } from '~/app/types/filter-object.type';

class FilterObjectNumber {
  @IsOptional()
  @IsNumberString()
  gt?: string;
  @IsOptional()
  @IsNumberString()
  gte?: string;
  @IsOptional()
  @IsNumberString()
  lt?: string;
  @IsOptional()
  @IsNumberString()
  lte?: string;
}

@ValidatorConstraint({ async: true, name: 'isNumberFilterObject' })
export class IsNumberFilterQueryConstraint
  implements ValidatorConstraintInterface
{
  async validate(value: FilterObject<number>): Promise<boolean> {
    if (typeof value === 'string') {
      return isNumberString(value);
    }
    const errors = await validate(plainToInstance(FilterObjectNumber, value));
    return !errors.length;
  }
}
