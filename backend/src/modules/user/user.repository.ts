import { User, IUser } from '../../shared/models/User.model';

/**
 * UserRepository: Repository cho User model.
 * Chỉ dùng trong module Auth và User.
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

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  // Update last login time
  async updateById(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }
}

export default new UserRepository();
