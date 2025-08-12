import { Response } from 'express';

export interface IResponseFormatter {
  formatSuccess(res: Response, message: string, data?: any, meta?: any): void;
  formatError(res: Response, status: number, message: string): void;
}

export class ResponseFormatter implements IResponseFormatter {
  formatSuccess(res: Response, message: string, data?: any, meta?: any): void {
    res.status(200).json({ success: true, message, data, ...(meta && { meta }) });
  }

  formatError(res: Response, status: number, message: string): void {
    res.status(status).json({ success: false, message });
  }
}