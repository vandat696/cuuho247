import Joi from 'joi';

export const createRequestSchema = Joi.object({
  company_id: Joi.string().required().messages({
    'string.empty': 'Vui long chon cong ty cuu ho',
    'any.required': 'Vui long chon cong ty cuu ho',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Vui long nhap mo ta tinh trang xe',
    'any.required': 'Vui long nhap mo ta tinh trang xe',
  }),
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  })
    .required()
    .messages({
      'object.base': 'Vi tri hien tai la bat buoc',
      'any.required': 'Vi tri hien tai la bat buoc',
    }),
  address: Joi.string().allow('', null),
  service_types: Joi.array().items(Joi.string()).optional(),
  incident_photos: Joi.array().items(Joi.string()).optional(),
});

export const acceptRequestSchema = Joi.object({
  vehicle_id: Joi.string().required().messages({
    'string.empty': 'Vui long chon xe cuu ho',
    'any.required': 'Vui long chon xe cuu ho',
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

export const cancelRequestSchema = Joi.object({
  reason: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Ly do huy khong duoc de trong',
    'any.required': 'Ly do huy la bat buoc',
  }),
});
