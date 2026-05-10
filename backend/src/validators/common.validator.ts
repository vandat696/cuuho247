import Joi from 'joi';

export const nameSchema = Joi.string().min(2).max(50).required().messages({
  'string.min': 'Họ tên phải có ít nhất {#limit} ký tự',
  'string.max': 'Họ tên không được vượt quá {#limit} ký tự',
  'any.required': 'Họ tên là bắt buộc',
  'string.empty': 'Họ tên không được để trống',
});

export const phoneSchema = Joi.string()
  .allow('', null)
  .pattern(/^[0-9]{10,11}$/) // Vietnam's phone number
  // .required()
  .messages({
    'string.pattern.base': 'Số điện thoại không hợp lệ (phải từ 10-11 số)',
    // 'any.required': 'Số điện thoại là bắt buộc',
    // 'string.empty': 'Số điện thoại không được để trống'
  });

export const emailSchema = Joi.string().trim().email().required().messages({
  'string.email': 'Email không đúng định dạng',
  'any.required': 'Email là bắt buộc',
  'string.empty': 'Email không được để trống',
});

export const passwordSchema = Joi.string()
  .min(8)
  .custom((value, helpers) => {
    if (/\s/.test(value)) {
      return helpers.error('password.noSpaces');
    }
    if (
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/.test(
        value
      )
    ) {
      return helpers.error('password.noVietnamese');
    }
    return value;
  })
  .required()
  .messages({
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
    'any.required': 'Mật khẩu là bắt buộc',
    'string.empty': 'Mật khẩu không được để trống',
    'password.noSpaces': 'Mật khẩu không được chứa khoảng cách',
    'password.noVietnamese': 'Mật khẩu không được chứa ký tự tiếng Việt',
  });
