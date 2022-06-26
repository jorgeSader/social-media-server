import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../keys';

export const getUserFromToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (err) {
    return null;
  }
};
