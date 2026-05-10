import Joi from 'joi';
import { emailSchema, passwordSchema, phoneSchema, nameSchema } from './common.validator';

export const customerRegisterSchema = Joi.object({
  full_name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});
