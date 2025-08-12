import { IAuth } from '../interfaces/auth/IAuth';

declare namespace Express {
  interface Request {
    user?: IAuth;
  }
}