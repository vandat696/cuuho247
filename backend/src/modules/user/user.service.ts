import userRepository from './user.repository';
import { NotFoundError, BadRequestError } from '@/shared/utils/apiError.util';
import { IUserService } from './interfaces/user.interface';

class UserService implements IUserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }
    const userObj = user.toObject();
    delete (userObj as any).password_hash;
    return userObj;
  }

  async updateProfile(
    userId: string,
    data: { full_name?: string; phone?: string; email?: string; avatar_url?: string }
  ) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }

    if (data.email && data.email !== user.email) {
      const existingEmail = await userRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new BadRequestError('Email này đã được sử dụng');
      }
      user.email = data.email;
    }

    if (data.full_name) user.full_name = data.full_name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.avatar_url) user.avatar_url = data.avatar_url;

    await user.save();

    const updatedUser = user.toObject();
    delete (updatedUser as any).password_hash;
    return updatedUser;
  }
}

export default new UserService();
