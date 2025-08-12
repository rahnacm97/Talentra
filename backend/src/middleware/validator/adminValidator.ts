import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../../utils/response';
import { isUUID } from 'validator';

//Signin Validation
export const validateSigninInput = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return ResponseHandler.sendErrorResponse(res, 400, 'Email and password are required');
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return ResponseHandler.sendErrorResponse(res, 400, 'Invalid email format');
  }
  next();
};

export const validateLogoutInput = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return ResponseHandler.sendErrorResponse(res, 400, 'Refresh token is required');
  }
  next();
};

export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id || !isUUID(id)) {
    return ResponseHandler.sendErrorResponse(res, 400, 'Valid ID is required');
  }
  next();
};

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
    return ResponseHandler.sendErrorResponse(res, 400, 'Invalid pagination parameters');
  }
  req.query.page = pageNum.toString();
  req.query.limit = limitNum.toString();
  next();
};