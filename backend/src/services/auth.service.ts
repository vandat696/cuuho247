import userRepository from '../repositories/user.repository';
import companyRepository from '../repositories/company.repository';
import { comparePassword, hashPassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { ApiError } from '../utils/apiError.util';

class AuthService {
  async customerRegister(userData: any) {
    const { email, password, full_name, phone } = userData;

    // Check for duplicate data: email
    const existingUser = await userRepository.findByEmail(email);
    const existingCompany = await companyRepository.findByEmail(email);
    if (existingUser || existingCompany) {
      throw new ApiError(400, 'Email đã được sử dụng');
    }

    // Hash password when register
    const hashedPassword = await hashPassword(password);

    // Save to Database
    const newUser = await userRepository.create({
      email,
      password_hash: hashedPassword,
      full_name,
      phone,
      status: 'active',
      is_verified: true,
    });

    // Return data without password hash
    const userResponse = newUser.toObject();
    delete userResponse.password_hash;

    return userResponse;
  }

  async registerCompany(companyData: any) {
    const { email, password, company_name, director_name, phone, address, service_area, license_file_url } =
      companyData;

    // Check for duplicate data: email
    const existingUser = await userRepository.findByEmail(email);
    const existingCompany = await companyRepository.findByEmail(email);
    if (existingUser || existingCompany) {
      throw new ApiError(400, 'Email đã được sử dụng');
    }

    // Hash password when register
    const hashedPassword = await hashPassword(password);

    // Save to Database
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
        coordinates: [0, 0],
      },
      service_area,
      license_file_url,
      status: 'pending_verification',
      is_verified: false,
    });

    // Return data without password hash
    const companyResponse = newCompany.toObject();
    delete companyResponse.password_hash;

    return companyResponse;
  }

  async login(userData: any) {
    const { email, password } = userData;

    // Check in table Users
    let account: any = await userRepository.findByEmail(email);
    let role = 'customer';
    let repository: any = userRepository;

    // If not found, check in table Companies
    if (!account) {
      account = await companyRepository.findByEmail(email);
      role = 'company';
      repository = companyRepository;
    }

    // If not found, throw error
    if (!account) {
      throw new ApiError(401, 'Email hoặc mật khẩu không chính xác');
    }

    // Check password
    if (!account.password_hash) {
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

    // Company-specific checks
    if (role === 'company') {
      const status = account.status as string | undefined;
      const isVerified = Boolean(account.is_verified);

      if (status === 'locked') {
        throw new ApiError(403, 'Tài khoản công ty đã bị khóa');
      }
      if (status === 'rejected') {
        throw new ApiError(403, 'Hồ sơ công ty đã bị từ chối. Vui lòng liên hệ hỗ trợ');
      }
      if (status === 'pending_verification' || !isVerified) {
        throw new ApiError(403, 'Tài khoản công ty chưa được xác minh. Vui lòng chờ quản trị viên phê duyệt');
      }
      if (status && status !== 'active') {
        throw new ApiError(403, 'Tài khoản công ty không ở trạng thái hoạt động');
      }
    }

    // 5. Update last login time
    await repository.updateById(account._id.toString(), { last_login_at: new Date() });

    // 6. Generate token
    const accessToken = generateToken(account._id.toString(), account.email, role);

    // 7. Clean data before return
    const accountResponse = account.toObject();
    delete accountResponse.password_hash;

    // 8. Return result
    return {
      user: accountResponse,
      role: role,
      access_token: accessToken,
    };
  }
}

export default new AuthService();
