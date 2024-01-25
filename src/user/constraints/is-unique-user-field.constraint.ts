import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UserService } from '~/user/user.service';

@ValidatorConstraint({ async: true, name: 'isUniqueUserField' })
@Injectable()
export class IsUniqueUserFieldConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UserService) {}

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} should be unique`;
  }

  async validate(
    value: unknown,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const user = await this.userService.findOne({
      [validationArguments.property]: value,
    });

    return !user;
  }
}
