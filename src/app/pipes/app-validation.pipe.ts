import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export class AppValidationPipe extends ValidationPipe {
  exceptionFactory = (validationErrors: ValidationError[]) => {
    const errors: Record<string, string[]> = {};

    validationErrors.forEach((validationError) => {
      errors[validationError.property] = Object.values(
        validationError.constraints,
      );
    });

    throw new BadRequestException(errors);
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
