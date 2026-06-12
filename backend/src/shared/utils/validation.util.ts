import { Schema, ValidationErrorItem } from 'joi';
import { BadRequestError } from './apiError.util';

interface ValidateOptions {
  abortEarly?: boolean;
  allowUnknown?: boolean;
  customMessage?: string;
  formatErrors?: 'string' | 'object';
}

export function validateSchema<T>(schema: Schema, data: any, options: ValidateOptions = {}): T {
  const { error, value } = schema.validate(data, {
    abortEarly: options.abortEarly ?? false,
    allowUnknown: options.allowUnknown ?? false,
  });

  if (error) {
    const format = options.formatErrors || 'string';
    const errors = error.details.map((detail: ValidationErrorItem) => {
      if (format === 'object') {
        return {
          field: detail.context?.key,
          message: detail.message,
        };
      }
      return detail.message;
    });

    const message =
      options.customMessage ||
      (typeof errors[0] === 'string' ? errors[0] : (errors[0] as any).message) ||
      'Dữ liệu không hợp lệ';

    throw new BadRequestError(message, 'VALIDATION_ERROR', errors);
  }

  return value as T;
}
