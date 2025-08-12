import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { IAuth } from '../interfaces/auth/IAuth';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: IAuth;
}

export const employerMiddleware = (
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

    console.log('decoded', decoded);

    if (decoded.role !== 'employer') {
      logger.warn('Unauthorized role access attempt', {
        role: decoded.role,
        path: req.path,
        method: req.method,
      });
      return res.status(403).json({ success: false, error: 'Employer access required' });
    }

    if (req.path === '/employer/verification') {
      if (decoded.userId !== req.user?.userId) {
        logger.warn('Employer attempted to access another user’s profile', {
          userId: decoded.userId,
          path: req.path,
          method: req.method,
        });
        return res.status(403).json({
          success: false,
          error: 'Cannot update another user’s profile',
        });
      }
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