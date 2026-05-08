import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import authService from '../services/auth.service';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validation input data
      const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
      
      if (error) {
        // Combine all error messages into an array to send to Frontend
        const errorMessages = error.details.map((detail) => detail.message);
        res.status(400).json({ 
          status: 'error', 
          message: 'Dữ liệu không hợp lệ', 
          errors: errorMessages 
        });
        return;
      }

      // Call Service to process data
      const newUser = await authService.register(value);

      // Response successfully (HTTP Status 201: Created)
      res.status(201).json({
        status: 'success',
        message: 'Đăng ký tài khoản thành công',
        data: newUser
      });

    } catch (err: any) {
      // Handle error
      if (err.message === 'Email đã được sử dụng') {
        res.status(400).json({ status: 'error', message: err.message });
        return;
      }

      // System error
      console.error('[AuthController.register] Error:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }
    async login(req: Request, res: Response): Promise<void> {
    try {
      // Validation input data
      const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
      
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        res.status(400).json({ 
          status: 'error', 
          message: 'Dữ liệu không hợp lệ', 
          errors: errorMessages 
        });
        return;
      }
      // Call Service to process data
      const loginResult = await authService.login(value);
      // Response successfully (HTTP Status 200: OK)
      res.status(200).json({
        status: 'success',
        message: 'Đăng nhập thành công',
        data: loginResult
      });

    } catch (err: any) {
      // Handle error
      if (err.message === 'Email hoặc mật khẩu không chính xác') {
        // Use 401 (Unauthorized) is the most standard when Login failed
        res.status(401).json({ status: 'error', message: err.message });
        return;
      }

      // System error
      console.error('[AuthController.login] Error:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }
}

export default new AuthController();
