import userRepository from '@/shared/repositories/user.repository';
import companyRepository from '@/modules/company/company.repository';
import { comparePassword, hashPassword } from '@/shared/utils/password.util';
import { generateToken } from '@/shared/utils/jwt.util';
import { ApiError } from '@/shared/utils/apiError.util';
import { Admin } from '@/shared/models/Admin.model';
import type {
  IAuthService,
  CustomerRegisterInput,
  CompanyRegisterInput,
  LoginInput,
  UserProfile,
  CompanyProfile,
  LoginResult,
} from './interfaces/auth.interface';

class AuthService implements IAuthService {
  async customerRegister(userData: CustomerRegisterInput): Promise<UserProfile> {
    const { email, password, full_name, phone } = userData;

    const existingUser = await userRepository.findByEmail(email);
    const existingCompany = await companyRepository.findByEmail(email);
    if (existingUser || existingCompany) {
      throw new ApiError(400, 'Email đã được sử dụng');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userRepository.create({
      email,
      password_hash: hashedPassword,
      full_name,
      phone,
      status: 'active',
      is_verified: true,
    });

    const userResponse = newUser.toObject();
    delete (userResponse as any).password_hash;

    return userResponse as unknown as UserProfile;
  }

  async registerCompany(companyData: CompanyRegisterInput): Promise<CompanyProfile> {
    const {
      email,
      password,
      company_name,
      director_name,
      phone,
      address,
      latitude,
      longitude,
      service_area,
      license_file_url,
    } = companyData;

    const existingUser = await userRepository.findByEmail(email);
    const existingCompany = await companyRepository.findByEmail(email);
    if (existingUser || existingCompany) {
      throw new ApiError(400, 'Email đã được sử dụng');
    }

    const hashedPassword = await hashPassword(password);

    const newCompany = await companyRepository.create({
      email,
      password_hash: hashedPassword,
      company_name,
      director_name,
      phone,
      address: {
        province: 'Chưa cập nhật',
        district: 'Chưa cập nhật',
        ward: 'Chưa cập nhật',
        detail: address,
      },
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      service_area,
      license_file_url,
      status: 'pending_verification',
      is_verified: false,
    });

    const companyResponse = newCompany.toObject();
    delete (companyResponse as any).password_hash;

    return companyResponse as unknown as CompanyProfile;
  }

  async login(userData: LoginInput): Promise<LoginResult> {
    const { email, password } = userData;

    let account: any = await userRepository.findByEmail(email);
    let role: 'customer' | 'company' | 'admin' = 'customer';
    let repository: any = userRepository;

    if (!account) {
      account = await companyRepository.findByEmail(email);
      if (account) {
        role = 'company';
        repository = companyRepository;
      }
    }

    if (!account) {
      account = await Admin.findOne({ email }).exec();
      if (account) {
        role = 'admin';
        repository = null;
      }
    }

    if (!account || !account.password_hash) {
      throw new ApiError(401, 'Email hoặc mật khẩu không chính xác');
    }

    let isPasswordValid = false;
    try {
      isPasswordValid = await comparePassword(password, account.password_hash);
    } catch {
      throw new ApiError(401, 'Email hoặc mật khẩu không chính xác');
    }

    if (!isPasswordValid) {
      throw new ApiError(401, 'Email hoặc mật khẩu không chính xác');
    }

    // Company approval is temporarily disabled. Companies can log in as long
    // as the account is not locked.
    if (role === 'company' && account.status === 'locked') {
      throw new ApiError(403, 'Tài khoản công ty đã bị khóa');
    }

    if (role === 'admin') {
      await Admin.findByIdAndUpdate(account._id, { last_login_at: new Date() }).exec();
    } else if (repository) {
      await repository.updateById(account._id.toString(), { last_login_at: new Date() });
    }

    const accessToken = generateToken(account._id.toString(), account.email, role);

    const accountResponse = account.toObject();
    delete accountResponse.password_hash;

    return {
      user: accountResponse,
      role,
      access_token: accessToken,
    };
  }
}

export default new AuthService();
