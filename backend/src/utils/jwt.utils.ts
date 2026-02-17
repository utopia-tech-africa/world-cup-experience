import * as jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const signJWT = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
};

export const verifyJWT = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, secret) as JWTPayload;
};
