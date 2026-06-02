import Joi from 'joi';
import { SERVICE_AREAS } from '@/shared/constants/serviceAreas';

// ─── Common schemas ────────────────────────────────────────────────────────────

const nameSchema = Joi.string().min(2).max(50).required().messages({
  'string.min': 'Họ tên phải có ít nhất {#limit} ký tự',
  'string.max': 'Họ tên không được vượt quá {#limit} ký tự',
  'any.required': 'Họ tên là bắt buộc',
  'string.empty': 'Họ tên không được để trống',
});

const companyNameSchema = Joi.string().min(2).max(100).required().messages({
  'string.min': 'Tên công ty phải có ít nhất {#limit} ký tự',
  'string.max': 'Tên công ty không được vượt quá {#limit} ký tự',
  'any.required': 'Tên công ty là bắt buộc',
  'string.empty': 'Tên công ty không được để trống',
});

const phoneSchema = Joi.string()
  .allow('', null)
  .pattern(/^[0-9]{10,11}$/)
  .messages({
    'string.pattern.base': 'Số điện thoại không hợp lệ (phải từ 10-11 số)',
  });

const emailSchema = Joi.string()
  .trim()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.email': 'Email không đúng định dạng',
    'any.required': 'Email là bắt buộc',
    'string.empty': 'Email không được để trống',
  });

const passwordSchema = Joi.string()
  .min(8)
  .custom((value, helpers) => {
    if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*$/.test(value)) {
      return helpers.error('password.invalidChars');
    }
    return value;
  })
  .required()
  .messages({
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
    'any.required': 'Mật khẩu là bắt buộc',
    'string.empty': 'Mật khẩu không được để trống',
    'password.invalidChars': 'Mật khẩu chỉ được chứa chữ cái a-z, A-Z, số và ký tự đặc biệt không bao gồm khoảng cách',
  });

// ─── Auth schemas ──────────────────────────────────────────────────────────────

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
