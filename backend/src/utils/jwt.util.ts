import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = '7d'; // 7 days

export const generateToken = (userId: string, email: string, role: string): string => {
  const payload = { id: userId, email, role };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

// Check token (valid or not)
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
