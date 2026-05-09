import userRepository from '../repositories/user.repository';
import companyRepository from '../repositories/company.repository';
import { comparePassword, hashPassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { ApiError } from '../utils/apiError.util';

class AuthService {
  async register(userData: any) {
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
    const isPasswordValid = await comparePassword(password, account.password_hash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Email hoặc mật khẩu không chính xác');
    }

    // 5. Update last login time
    await repository.updateById(account.id, { last_login_at: new Date() });

    // 6. Generate token
    const accessToken = generateToken(account.id || account._id.toString(), account.email, role);

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
