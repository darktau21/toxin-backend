import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { EmailService } from '../email.service';

@ValidatorConstraint({ async: true, name: 'isUniqueEmailData' })
@Injectable()
export class IsOldEmailDataExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly emailService: EmailService) {}

  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} doesn't exists`;
  }

  async validate(
    value: string,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    return this.emailService.isOldEmailDataExists(
      validationArguments.property,
      value,
    );
  }
}
