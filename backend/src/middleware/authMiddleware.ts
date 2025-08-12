import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { IAuth } from '../interfaces/auth/IAuth';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: IAuth;
}

//Authentication token
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('No token provided', { path: req.path, method: req.method });
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as IAuth;
    req.user = decoded;

    console.log("decoded",decoded)

    if (decoded.role !== 'admin' && decoded.role !== 'employer' && decoded.role !== 'candidate' ) {
      logger.warn('Unauthorized role access attempt', { role: decoded.role, path: req.path, method: req.method });
      return res.status(403).json({ success: false, error: 'Access required' });
    }

    next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.error('Invalid token', {
        error: error.message,
        path: req.path,
        method: req.method,
        code: error.name,
      });
      return res.status(401).json({ success: false, error: 'Token expired, please refresh' });
    } else if (error instanceof Error) {
      logger.error('Invalid token', {
        error: error.message,
        path: req.path,
        method: req.method,
        code: 'InvalidToken',
      });
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    } else {
      logger.error('Unexpected error', {
        error: 'Unknown error type',
        path: req.path,
        method: req.method,
      });
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
};