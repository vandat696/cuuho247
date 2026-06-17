import userRepository from '@/modules/user/user.repository';
import companyRepository from '@/modules/company/company.repository';
import adminRepository from '@/modules/admin/admin.repository';
import { comparePassword, hashPassword } from '@/shared/utils/password.util';
import { generateToken, generateRefreshToken, REFRESH_TOKEN_EXPIRES_IN_DAYS } from '@/shared/utils/jwt.util';
import { BadRequestError, UnauthorizedError, ForbiddenError } from '@/shared/utils/apiError.util';
import { ErrorCode } from '@/shared/constants/error.constant';
import { RefreshToken } from '@/shared/models/RefreshToken.model';

import type {
  CustomerRegisterInput,
  CompanyRegisterInput,
  LoginInput,
  UserProfile,
  CompanyProfile,
  LoginResult,
} from './interfaces/auth.interface';

class AuthService {
  async customerRegister(userData: CustomerRegisterInput): Promise<UserProfile> {
    const { email, password, full_name, phone } = userData;

    const existingUser = await userRepository.findByEmail(email);
    const existingCompany = await companyRepository.findByEmail(email);
    const existingAdmin = await adminRepository.findByEmail(email);
    if (existingUser || existingCompany || existingAdmin) {
      throw new BadRequestError('Email đã được sử dụng');
    }

    const finalPhone = phone === '' ? undefined : phone;

    if (finalPhone) {
      const existingUserPhone = await userRepository.findByPhone(finalPhone);
      const existingCompanyPhone = await companyRepository.findByPhone(finalPhone);
      if (existingUserPhone || existingCompanyPhone) {
        throw new BadRequestError('Số điện thoại đã được sử dụng');
      }
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userRepository.create({
      email,
      password_hash: hashedPassword,
      full_name,
      phone: finalPhone,
      status: 'active',
    });

    const userResponse = newUser.toObject();
    delete (userResponse as any).password_hash;

    return userResponse as unknown as UserProfile;
  }

  async registerCompany(companyData: CompanyRegisterInput): Promise<CompanyProfile> {
    const { email, password, company_name, director_name, phone, address, latitude, longitude, license_file_url } =
      companyData;

    const existingUser = await userRepository.findByEmail(email);
    const existingCompany = await companyRepository.findByEmail(email);
    const existingAdmin = await adminRepository.findByEmail(email);
    if (existingUser || existingCompany || existingAdmin) {
      throw new BadRequestError('Email đã được sử dụng');
    }

    if (phone) {
      const existingUserPhone = await userRepository.findByPhone(phone);
      const existingCompanyPhone = await companyRepository.findByPhone(phone);
      if (existingUserPhone || existingCompanyPhone) {
        throw new BadRequestError('Số điện thoại đã được sử dụng');
      }
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

    let account: any = await adminRepository.findByEmail(email);
    let role: 'customer' | 'company' | 'admin' = 'admin';
    let repository: any = null;

    if (!account) {
      account = await userRepository.findByEmail(email);
      if (account) {
        role = 'customer';
        repository = userRepository;
      }
    }

    if (!account) {
      account = await companyRepository.findByEmail(email);
      if (account) {
        role = 'company';
        repository = companyRepository;
      }
    }

    if (!account || !account.password_hash) {
      throw new UnauthorizedError('Email hoặc mật khẩu không chính xác');
    }

    let isPasswordValid = false;
    try {
      isPasswordValid = await comparePassword(password, account.password_hash);
    } catch {
      throw new UnauthorizedError('Email hoặc mật khẩu không chính xác');
    }

    if (!isPasswordValid) {
      throw new UnauthorizedError('Email hoặc mật khẩu không chính xác');
    }

    // Company approval is temporarily disabled. Companies can log in as long
    // as the account is not locked.
    if (role === 'company' && account.status === 'locked') {
      throw new ForbiddenError(
        `Tài khoản công ty đã bị khóa. Lý do: ${account.lock_reason || 'Không rõ lý do'}`,
        ErrorCode.COMPANY_LOCKED
      );
    }

    if (role === 'customer' && account.status === 'locked') {
      throw new ForbiddenError(
        `Tài khoản của bạn đã bị khóa. Lý do: ${account.lock_reason || 'Không rõ lý do'}`,
        ErrorCode.USER_LOCKED
      );
    }

    if (role === 'admin') {
      await adminRepository.updateById(account._id.toString(), { last_login_at: new Date() });
    } else if (repository) {
      await repository.updateById(account._id.toString(), { last_login_at: new Date() });
    }

    const accessToken = generateToken(account._id.toString(), account.email, role);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

    await RefreshToken.create({
      user_id: account._id.toString(),
      token: refreshToken,
      expires_at: expiresAt,
    });

    const accountResponse = account.toObject();
    delete accountResponse.password_hash;

    return {
      user: accountResponse,
      role,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token: string): Promise<{ access_token: string }> {
    const existingToken = await RefreshToken.findOne({ token }).exec();
    if (!existingToken) {
      throw new UnauthorizedError('Refresh token không hợp lệ hoặc đã bị thu hồi');
    }

    if (existingToken.expires_at < new Date()) {
      await RefreshToken.deleteOne({ _id: existingToken._id }).exec();
      throw new UnauthorizedError('Refresh token đã hết hạn, vui lòng đăng nhập lại');
    }

    const userId = existingToken.user_id;
    let account: any = await adminRepository.findById(userId);
    let role = 'admin';

    if (!account) {
      account = await userRepository.findById(userId);
      if (account) role = 'customer';
    }

    if (!account) {
      account = await companyRepository.findById(userId);
      if (account) role = 'company';
    }

    if (!account) {
      throw new UnauthorizedError('Tài khoản không tồn tại');
    }

    if (role === 'company' && account.status === 'locked') {
      throw new ForbiddenError(
        `Tài khoản công ty đã bị khóa. Lý do: ${account.lock_reason || 'Không rõ lý do'}`,
        ErrorCode.COMPANY_LOCKED
      );
    }

    if (role === 'customer' && account.status === 'locked') {
      throw new ForbiddenError(
        `Tài khoản của bạn đã bị khóa. Lý do: ${account.lock_reason || 'Không rõ lý do'}`,
        ErrorCode.USER_LOCKED
      );
    }

    const accessToken = generateToken(account._id.toString(), account.email, role);

    return { access_token: accessToken };
  }

  async logout(token: string): Promise<void> {
    await RefreshToken.deleteOne({ token }).exec();
  }
}

export default new AuthService();
