import Joi from 'joi';

export const createVehicleSchema = Joi.object({
  plate_number: Joi.string().trim().min(5).max(20).required().messages({
    'string.min': 'Bien so xe phai co it nhat {#limit} ky tu',
    'string.max': 'Bien so xe khong duoc vuot qua {#limit} ky tu',
    'any.required': 'Bien so xe la bat buoc',
    'string.empty': 'Bien so xe khong duoc de trong',
  }),
  vehicle_type: Joi.string().trim().required().messages({
    'any.required': 'Loai phuong tien la bat buoc',
    'string.empty': 'Loai phuong tien khong duoc de trong',
  }),
  status: Joi.string().valid('available', 'unavailable').default('available').messages({
    'any.only': 'Trang thai phuong tien khong hop le',
  }),
});

export const updateVehicleSchema = Joi.object({
  plate_number: Joi.string().trim().min(5).max(20).messages({
    'string.min': 'Bien so xe phai co it nhat {#limit} ky tu',
    'string.max': 'Bien so xe khong duoc vuot qua {#limit} ky tu',
    'string.empty': 'Bien so xe khong duoc de trong',
  }),
  vehicle_type: Joi.string().trim().messages({
    'string.empty': 'Loai phuong tien khong duoc de trong',
  }),
  status: Joi.string().valid('available', 'unavailable').messages({
    'any.only': 'Trang thai phuong tien khong hop le',
  }),
})
  .min(1)
  .messages({
    'object.min': 'Phai cung cap it nhat mot truong thong tin de cap nhat',
  });
