import { plainToInstance } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  isDateString,
  validate,
} from 'class-validator';

export class FilterObjectDate {
  @IsOptional()
  @IsDateString()
  gt?: string;
  @IsOptional()
  @IsDateString()
  gte?: string;
  @IsOptional()
  @IsDateString()
  lt?: string;
  @IsOptional()
  @IsDateString()
  lte?: string;
}

@ValidatorConstraint({ async: true, name: 'isDateFilterObject' })
export class IsDateFilterQueryConstraint
  implements ValidatorConstraintInterface
{
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} should be a valid ISO Date string or object`;
  }

  async validate(value: FilterObjectDate | string): Promise<boolean> {
    if (typeof value === 'string') {
      return isDateString(value);
    }
    const errors = await validate(plainToInstance(FilterObjectDate, value), {
      forbidNonWhitelisted: true,
      whitelist: true,
    });
    return !errors.length;
  }
}
