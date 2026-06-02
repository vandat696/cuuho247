import { User, IUser } from '../models/User.model';

/**
 * UserRepository: Repository cho User model.
 * Chỉ dùng trong module Auth.
 * Nằm ở shared/ vì Auth module cần nó và không thuộc về một module nghiệp vụ cụ thể.
 */
class UserRepository {
  // Check for duplicate data: email
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  // Create new user
  async create(userData: Partial<IUser>): Promise<IUser> {
    const newUser = new User(userData);
    return newUser.save();
  }

  // Update last login time
  async updateById(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }
}

export default new UserRepository();
