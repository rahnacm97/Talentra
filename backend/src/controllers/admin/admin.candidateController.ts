import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../../interfaces/logger/ILogger';
import { ISocketEventHandler } from '../../interfaces/socket/ISocketEventHandler';
import { IAdminCandidateService } from '../../interfaces/users/admin/IAdminCandidateService';
import { IResponseFormatter } from '../../interfaces/response/IResponseFormatter';

export class AdminCandidateController {
  constructor(
    private adminCandidateService: IAdminCandidateService,
    private logger: ILogger,
    private socketEventHandler: ISocketEventHandler,
    private responseFormatter: IResponseFormatter
  ) {}

  // All Candidates
  getAllCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 5, search = '' } = req.query;
      const candidates = await this.adminCandidateService.getAllCandidates(Number(page), Number(limit), search as string);
      this.responseFormatter.formatSuccess(res, 'Candidates retrieved successfully', candidates.data, { total: candidates.total });
    } catch (error: any) {
      this.logger.error(`AdminCandidateController getAllCandidates error: ${error.message}`, error);
      next(error);
    }
  };

  // Single Candidate
  getCandidateView = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      if (!id) {
        return this.responseFormatter.formatError(res, 400, 'Candidate ID is required');
      }
      const candidate = await this.adminCandidateService.getCandidateById(id);
      if (!candidate) {
        return this.responseFormatter.formatError(res, 404, 'Candidate not found');
      }
      this.responseFormatter.formatSuccess(res, 'Candidate details retrieved successfully', candidate);
    } catch (error: any) {
      this.logger.error(`AdminCandidateController getCandidateView error for ID ${id}: ${error.message}`, error);
      next(error);
    }
  };

  // Candidate blocking
  toggleCandidateBlocked = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { blocked } = req.body;
    try {
      if (!id || typeof blocked !== 'boolean') {
        return this.responseFormatter.formatError(res, 400, 'Candidate ID and blocked status are required');
      }
      const candidate = await this.adminCandidateService.toggleCandidateBlocked(id, blocked);
      if (!candidate) {
        return this.responseFormatter.formatError(res, 404, 'Candidate not found');
      }
      this.responseFormatter.formatSuccess(res, `Candidate ${blocked ? 'blocked' : 'unblocked'} successfully`, candidate);
    } catch (error: any) {
      this.logger.error(`AdminCandidateController toggleCandidateBlocked error for ID ${id}: ${error.message}`, error);
      next(error);
    }
  };
}
