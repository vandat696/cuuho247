import { Request, Response, NextFunction } from 'express';
import { customerRegisterSchema, loginSchema, registerCompanySchema } from './auth.validator';
import authService from './auth.service';
import { validateSchema } from '../../shared/utils/validation.util';

class AuthController {
  async customerRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validation input data
      const value = validateSchema<any>(customerRegisterSchema, req.body, {
        abortEarly: false,
        customMessage: 'Dữ liệu không hợp lệ',
      });

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
      const licenseFileUrl = req.file ? req.file.path : '';
      const requestBody = {
        ...req.body,
        ...(licenseFileUrl ? { license_file_url: licenseFileUrl } : {}),
      };

      // Validation input data - using registerCompanySchema
      const value = validateSchema<any>(registerCompanySchema, requestBody, {
        abortEarly: false,
        allowUnknown: true,
        customMessage: 'Dữ liệu không hợp lệ',
      });

      // Call Service to process data
      const newCompany = await authService.registerCompany(value);

      // Response successfully (HTTP Status 201: Created)
      res.status(201).json({
        status: 'success',
        message: 'Đăng ký công ty thành công',
        data: newCompany,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validation input data
      const value = validateSchema<any>(loginSchema, req.body, {
        abortEarly: false,
        customMessage: 'Dữ liệu không hợp lệ',
      });

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

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        res.status(400).json({ status: 'error', message: 'Refresh token là bắt buộc' });
        return;
      }

      const result = await authService.refreshToken(refresh_token);

      res.status(200).json({
        status: 'success',
        message: 'Làm mới token thành công',
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refresh_token } = req.body;
      if (refresh_token) {
        await authService.logout(refresh_token);
      }

      res.status(200).json({
        status: 'success',
        message: 'Đăng xuất thành công',
      });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new AuthController();
