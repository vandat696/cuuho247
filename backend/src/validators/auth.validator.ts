import Joi from 'joi';
import { emailSchema, passwordSchema, phoneSchema, nameSchema, companyNameSchema } from './common.validator';
import { SERVICE_AREAS } from '../constants/serviceAreas';

export const customerRegisterSchema = Joi.object({
  full_name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const registerCompanySchema = Joi.object({
  company_name: companyNameSchema,
  director_name: nameSchema,
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required()
    .messages({
      'string.pattern.base': 'Số điện thoại không hợp lệ (phải từ 10-11 số)',
      'any.required': 'Số điện thoại là bắt buộc',
    }),
  email: emailSchema,
  password: passwordSchema,
  address: Joi.string().min(5).max(200).required().messages({
    'string.min': 'Địa chỉ phải có ít nhất {#limit} ký tự',
    'string.max': 'Địa chỉ không được vượt quá {#limit} ký tự',
    'any.required': 'Địa chỉ là bắt buộc',
    'string.empty': 'Địa chỉ không được để trống',
  }),
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.base': 'Vĩ độ công ty không hợp lệ',
    'number.min': 'Vĩ độ công ty không hợp lệ',
    'number.max': 'Vĩ độ công ty không hợp lệ',
    'any.required': 'Vị trí công ty là bắt buộc',
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.base': 'Kinh độ công ty không hợp lệ',
    'number.min': 'Kinh độ công ty không hợp lệ',
    'number.max': 'Kinh độ công ty không hợp lệ',
    'any.required': 'Vị trí công ty là bắt buộc',
  }),
  service_area: Joi.string()
    .valid(...SERVICE_AREAS.map((area) => area.id))
    .required()
    .messages({
      'any.only': 'Khu vực hoạt động không hợp lệ',
      'any.required': 'Khu vực hoạt động là bắt buộc',
      'string.empty': 'Khu vực hoạt động không được để trống',
    }),
  license_file_url: Joi.string().uri().max(500).optional().messages({
    'string.uri': 'Link giấy phép không hợp lệ (phải là URL)',
    'string.max': 'Link giấy phép không được vượt quá {#limit} ký tự',
  }),
  // multipart/form-data sends booleans as strings ("true"/"false") so we accept both.
  terms_accepted: Joi.boolean()
    .truthy('true')
    .truthy('1')
    .truthy('on')
    .falsy('false')
    .falsy('0')
    .valid(true)
    .required()
    .messages({
      'any.only': 'Bạn phải đồng ý với Điều khoản dịch vụ',
      'any.required': 'Bạn phải đồng ý với Điều khoản dịch vụ',
    }),
});

export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});
