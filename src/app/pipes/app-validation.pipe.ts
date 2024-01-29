import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { HttpException } from '../exceptions';

export class AppValidationPipe extends ValidationPipe {
  exceptionFactory = (validationErrors: ValidationError[]) => {
    const errors: Record<string, string[]> = {};

    validationErrors.forEach((validationError) => {
      errors[validationError.property] = Object.values(
        validationError.constraints,
      );
    });

    throw new HttpException(errors, HttpStatus.BAD_REQUEST);
  };

  constructor() {
    super({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      whitelist: true,
    });
  }
}
