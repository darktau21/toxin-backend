import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { EmailService } from '../email.service';

@ValidatorConstraint({ async: true, name: 'isUniqueEmailData' })
@Injectable()
export class IsUniqueEmailDataConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly emailService: EmailService) {}

  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} already exists`;
  }

  async validate(
    value: string,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    return !(await this.emailService.isNewEmailDataExists(
      validationArguments.property,
      value,
    ));
  }
}
