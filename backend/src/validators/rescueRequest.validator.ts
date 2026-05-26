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
