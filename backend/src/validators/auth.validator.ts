import Joi from 'joi';
import { emailSchema, passwordSchema, phoneSchema, nameSchema } from './common.validator';

export const customerRegisterSchema = Joi.object({
  full_name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
  // confirm_password: Joi.any().valid(Joi.ref('password')).required()
});

export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});
