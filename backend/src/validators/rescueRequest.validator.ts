import Joi from 'joi';

export const cancelRequestSchema = Joi.object({
  reason: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Lý do hủy không được để trống',
    'any.required': 'Lý do hủy là bắt buộc',
  }),
});
