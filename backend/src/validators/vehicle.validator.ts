import Joi from 'joi';

export const createVehicleSchema = Joi.object({
  plate_number: Joi.string().trim().min(5).max(20).required().messages({
    'string.min': 'Biển số xe phải có ít nhất {#limit} ký tự',
    'string.max': 'Biển số xe không được vượt quá {#limit} ký tự',
    'any.required': 'Biển số xe là bắt buộc',
    'string.empty': 'Biển số xe không được để trống',
  }),
  vehicle_type: Joi.string().trim().required().messages({
    'any.required': 'Loại phương tiện là bắt buộc',
    'string.empty': 'Loại phương tiện không được để trống',
  }),
  status: Joi.string().valid('available', 'unavailable').default('available').messages({
    'any.only': 'Trạng thái phương tiện không hợp lệ',
  }),
});

export const updateVehicleSchema = Joi.object({
  plate_number: Joi.string().trim().min(5).max(20).messages({
    'string.min': 'Biển số xe phải có ít nhất {#limit} ký tự',
    'string.max': 'Biển số xe không được vượt quá {#limit} ký tự',
    'string.empty': 'Biển số xe không được để trống',
  }),
  vehicle_type: Joi.string().trim().messages({
    'string.empty': 'Loại phương tiện không được để trống',
  }),
  status: Joi.string().valid('available', 'unavailable').messages({
    'any.only': 'Trạng thái phương tiện không hợp lệ',
  }),
})
  .min(1)
  .messages({
    'object.min': 'Phải cung cấp ít nhất một trường thông tin để cập nhật',
  });
