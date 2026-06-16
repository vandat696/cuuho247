import { Admin, IAdmin } from '../../shared/models/Admin.model';

class AdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email }).exec();
  }

  async updateById(adminId: string, updateData: Partial<IAdmin>): Promise<IAdmin | null> {
    return Admin.findByIdAndUpdate(adminId, updateData, { new: true }).exec();
  }
}

export default new AdminRepository();
