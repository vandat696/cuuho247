import { IUser } from '@/shared/models/User.model';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(userData: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  updateById(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
}

export interface IUserService {
  getProfile(userId: string): Promise<any>;
  updateProfile(
    userId: string,
    data: { full_name?: string; phone?: string; email?: string; avatar_url?: string }
  ): Promise<any>;
}
