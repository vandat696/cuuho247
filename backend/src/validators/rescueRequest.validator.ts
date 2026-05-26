import Joi from 'joi';

export const createRequestSchema = Joi.object({
  company_id: Joi.string().required().messages({
    'string.empty': 'Vui lòng chọn công ty cứu hộ',
    'any.required': 'Vui lòng chọn công ty cứu hộ',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Vui lòng nhập mô tả tình trạng xe',
    'any.required': 'Vui lòng nhập mô tả tình trạng xe',
  }),
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  })
    .required()
    .messages({
      'object.base': 'Vị trí hiện tại là bắt buộc',
      'any.required': 'Vị trí hiện tại là bắt buộc',
    }),
  address: Joi.string().allow('', null),
  service_types: Joi.array().items(Joi.string()).optional(),
  incident_photos: Joi.array().items(Joi.string()).optional(),
});

export const acceptRequestSchema = Joi.object({
  vehicle_id: Joi.string().required().messages({
    'string.empty': 'Vui lòng chọn xe cứu hộ',
    'any.required': 'Vui lòng chọn xe cứu hộ',
  }),
  eta_minutes: Joi.number().integer().min(1).max(1440).required().messages({
    'number.base': 'Thời gian dự kiến đến phải là số phút',
    'number.integer': 'Thời gian dự kiến đến phải là số phút nguyên',
    'number.min': 'Thời gian dự kiến đến phải lớn hơn 0 phút',
    'number.max': 'Thời gian dự kiến đến không được vượt quá 1440 phút',
    'any.required': 'Vui lòng nhập thời gian dự kiến đến',
  }),
  note: Joi.string().allow('', null).optional(),
});

export const cancelRequestSchema = Joi.object({
  reason: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Lý do hủy không được để trống',
    'any.required': 'Lý do hủy là bắt buộc',
  }),
});
