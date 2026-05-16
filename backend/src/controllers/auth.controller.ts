import { Request, Response, NextFunction } from 'express';
import { ValidationErrorItem } from 'joi';
import { customerRegisterSchema, loginSchema, registerCompanySchema } from '../validators/auth.validator';
import authService from '../services/auth.service';

class AuthController {
  async customerRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validation input data
      const { error, value } = customerRegisterSchema.validate(req.body, { abortEarly: false });

      if (error) {
        // Combine all error messages into an array to send to Frontend
        const errorMessages = error.details.map((detail: ValidationErrorItem) => detail.message);
        res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          errors: errorMessages,
        });
        return;
      }

      // Call Service to process data
      const newUser = await authService.customerRegister(value);

      // Response successfully (HTTP Status 201: Created)
      res.status(201).json({
        status: 'success',
        message: 'Đăng ký tài khoản thành công',
        data: newUser,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async registerCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const licenseFileUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined;
      const requestBody = {
        ...req.body,
        ...(licenseFileUrl ? { license_file_url: licenseFileUrl } : {}),
      };

      // Validation input data - using registerCompanySchema
      const { error, value } = registerCompanySchema.validate(requestBody, {
        abortEarly: false,
        allowUnknown: true,
      });

      if (error) {
        const errorMessages = error.details.map((detail: ValidationErrorItem) => detail.message);
        res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          errors: errorMessages,
        });
        return;
      }

      // Call Service to process data
      const newCompany = await authService.registerCompany(value);

      // Response successfully (HTTP Status 201: Created)
      res.status(201).json({
        status: 'success',
        message: 'Đăng ký công ty thành công. Chờ xác minh từ quản trị viên',
        data: newCompany,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validation input data
      const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

      if (error) {
        const errorMessages = error.details.map((detail: ValidationErrorItem) => detail.message);
        res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          errors: errorMessages,
        });
        return;
      }

      // Call Service to process data
      const loginResult = await authService.login(value);

      // Response successfully (HTTP Status 200: OK)
      res.status(200).json({
        status: 'success',
        message: 'Đăng nhập thành công',
        data: loginResult,
      });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new AuthController();
