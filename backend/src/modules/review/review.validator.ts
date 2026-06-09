import Joi from 'joi';

export const createReviewSchema = Joi.object({
  rescue_request_id: Joi.string().required().messages({
    'string.empty': 'Mã yêu cầu cứu hộ không được để trống',
    'any.required': 'Mã yêu cầu cứu hộ là bắt buộc',
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Đánh giá phải là một số',
    'number.min': 'Đánh giá tối thiểu là 1 sao',
    'number.max': 'Đánh giá tối đa là 5 sao',
    'any.required': 'Vui lòng chọn số sao đánh giá',
  }),
  detailed_ratings: Joi.object({
    response_time: Joi.number().integer().min(1).max(5),
    service_quality: Joi.number().integer().min(1).max(5),
    staff_attitude: Joi.number().integer().min(1).max(5),
    pricing: Joi.number().integer().min(1).max(5),
  }).optional(),
  content: Joi.string().max(1000).optional().allow('', null).messages({
    'string.max': 'Nhận xét không được vượt quá 1000 ký tự',
  }),
});

export const replyReviewSchema = Joi.object({
  content: Joi.string().trim().min(1).max(500).required().messages({
    'string.empty': 'Nội dung phản hồi không được để trống',
    'string.min': 'Nội dung phản hồi không được để trống',
    'string.max': 'Nội dung phản hồi không được vượt quá 500 ký tự',
    'any.required': 'Nội dung phản hồi là bắt buộc',
  }),
});
