import jwt from 'jsonwebtoken';
import 'dotenv/config';

const EXPIRES_IN = '7d'; // 7 days

const getJwtSecret = (): string => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }

  return 'cuuho247-local-dev-secret';
};

export const generateToken = (userId: string, email: string, role: string): string => {
  const payload = { id: userId, email, role };

  return jwt.sign(payload, getJwtSecret(), { expiresIn: EXPIRES_IN });
};

// Check token (valid or not)
export const verifyToken = (token: string) => {
  return jwt.verify(token, getJwtSecret());
};
