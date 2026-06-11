import { Response } from 'express';
import { Schema, ValidationErrorItem } from 'joi';

interface ValidateOptions {
  abortEarly?: boolean;
  allowUnknown?: boolean;
  customMessage?: string;
  formatErrors?: 'string' | 'object';
}

export function validateSchema<T>(schema: Schema, data: any, res: Response, options: ValidateOptions = {}): T | null {
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

    res.status(400).json({
      status: 'error',
      message:
        options.customMessage ||
        (typeof errors[0] === 'string' ? errors[0] : (errors[0] as any).message) ||
        'Dữ liệu không hợp lệ',
      errors,
    });
    return null;
  }

  return value as T;
}
