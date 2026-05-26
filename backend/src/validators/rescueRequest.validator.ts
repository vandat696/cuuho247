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
    'string.empty': 'Vui long chon xe cuu ho',
    'any.required': 'Vui lòng chọn xe cứu hộ',
  }),
  eta_minutes: Joi.number().integer().min(1).max(1440).required().messages({
    'number.base': 'Thoi gian du kien den phai la so phut',
    'number.integer': 'Thoi gian du kien den phai la so phut nguyen',
    'number.min': 'Thoi gian du kien den phai lon hon 0 phut',
    'number.max': 'Thoi gian du kien den khong duoc vuot qua 1440 phut',
    'any.required': 'Vui long nhap thoi gian du kien den',
  }),
  note: Joi.string().allow('', null).optional(),
});
