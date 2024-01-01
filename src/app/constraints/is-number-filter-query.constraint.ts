import { Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  isNumberString,
  validate,
} from 'class-validator';

export class FilterObjectNumber {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  gt?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  gte?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lt?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lte?: number;
}

@ValidatorConstraint({ async: true, name: 'isNumberFilterObject' })
export class IsNumberFilterQueryConstraint
  implements ValidatorConstraintInterface
{
  async validate(value: FilterObjectNumber | number): Promise<boolean> {
    if (typeof value === 'string') {
      return isNumberString(value);
    }
    const errors = await validate(plainToInstance(FilterObjectNumber, value), {
      forbidNonWhitelisted: true,
      whitelist: true,
    });
    return !errors.length;
  }
}
