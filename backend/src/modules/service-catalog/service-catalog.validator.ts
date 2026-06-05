import Joi from 'joi';

export const createServiceSchema = Joi.object({
  company_id: Joi.string().required().messages({
    'any.required': 'ID công ty là bắt buộc',
    'string.empty': 'ID công ty không được để trống',
  }),
  category_id: Joi.string().required().messages({
    'any.required': 'Danh mục dịch vụ là bắt buộc',
    'string.empty': 'Danh mục dịch vụ không được để trống',
  }),
  name: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Tên dịch vụ phải có ít nhất {#limit} ký tự',
    'string.max': 'Tên dịch vụ không được vượt quá {#limit} ký tự',
    'any.required': 'Tên dịch vụ là bắt buộc',
    'string.empty': 'Tên dịch vụ không được để trống',
  }),
  description: Joi.string().max(500).allow('', null).messages({
    'string.max': 'Mô tả không được vượt quá {#limit} ký tự',
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Giá dịch vụ không được nhỏ hơn 0',
    'any.required': 'Giá dịch vụ là bắt buộc',
  }),
  is_active: Joi.boolean().default(true),
});

export const updateServiceSchema = Joi.object({
  company_id: Joi.string(),
  category_id: Joi.string(),
  name: Joi.string().min(3).max(100),
  description: Joi.string().max(500).allow('', null),
  price: Joi.number().min(0),
  is_active: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'Phải cung cấp ít nhất một trường thông tin để cập nhật',
  });
