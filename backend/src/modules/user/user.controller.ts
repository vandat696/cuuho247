import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import userService from './user.service';

class UserController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }

      const profile = await userService.getProfile(userId);
      res.status(200).json({ status: 'success', data: profile });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }

      const { name, phone, email } = req.body;
      const dataToUpdate: any = {};
      if (name) dataToUpdate.full_name = name;
      if (phone !== undefined) dataToUpdate.phone = phone;
      if (email) dataToUpdate.email = email;

      if (req.file) {
        dataToUpdate.avatar_url = `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(req.file.filename)}`;
      }

      const updatedProfile = await userService.updateProfile(userId, dataToUpdate);
      res.status(200).json({ status: 'success', data: updatedProfile, message: 'Cập nhật thành công' });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
