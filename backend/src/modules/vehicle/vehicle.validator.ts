import Joi from 'joi';

export const createVehicleSchema = Joi.object({
  plate_number: Joi.string()
    .pattern(/^[A-Z0-9\-.]{4,12}$/)
    .required()
    .messages({
      'string.pattern.base': 'Biển số xe không hợp lệ',
      'any.required': 'Biển số xe là bắt buộc',
    }),
  vehicle_type: Joi.string().min(2).max(50).required().messages({
    'any.required': 'Loại xe là bắt buộc',
  }),
  status: Joi.string().valid('available', 'unavailable').optional(),
});

export const updateVehicleSchema = Joi.object({
  plate_number: Joi.string()
    .pattern(/^[A-Z0-9\-.]{4,12}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Biển số xe không hợp lệ',
    }),
  vehicle_type: Joi.string().min(2).max(50).optional(),
  status: Joi.string().valid('available', 'unavailable').optional(),
}).min(1);
