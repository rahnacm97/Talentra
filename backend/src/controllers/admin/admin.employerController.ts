import { Request, Response, NextFunction } from "express";
import { ILogger } from "../../interfaces/logger/ILogger";
import { ISocketEventHandler } from "../../interfaces/socket/ISocketEventHandler";
import { IAdminEmployerService } from "../../interfaces/users/admin/IAdminEmployerService";
import { IResponseFormatter } from "../../interfaces/response/IResponseFormatter"

export class AdminEmployerController {
  constructor(
    private adminEmployerService: IAdminEmployerService,
    private logger: ILogger,
    private socketEventHandler: ISocketEventHandler,
    private responseFormatter: IResponseFormatter
  ) {}

  // All Employers
  getAllEmployers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 5, search = '' } = req.query;
      const employers = await this.adminEmployerService.getAllEmployers(Number(page), Number(limit), search as string);
      this.responseFormatter.formatSuccess(res, 'Employers retrieved successfully', employers.data, { total: employers.total } );
    } catch (error: any) {
      this.logger.error(`AdminEmployerController getAllEmployers error: ${error.message}`, error);
      next(error);
    }
  }

  // Single Employer
  getEmployerView = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      if (!id) {
        return this.responseFormatter.formatError(res, 400, 'Employer ID required');
      }
      const employer = await this.adminEmployerService.getEmployerById(id);
      if (!employer) {
        return this.responseFormatter.formatError(res, 404, 'Employer not found');
      }
      this.responseFormatter.formatSuccess(res, 'Employer details retrieved successfully', employer);
    } catch (error: any) {
      this.logger.error(`AdminEmployerController getEmployerView error for id ${id}: ${error.message}`, error);
      next(error);
    }
  }

  // Employer blocking
  toggleEmployerBlocked = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { blocked } = req.body;
    try {
      if (!id || typeof blocked !== 'boolean') {
        return this.responseFormatter.formatError(res, 400, 'Employer ID and blocked status are required');
      }
      const employer = await this.adminEmployerService.toggleEmployerBlocked(id, blocked);
      if (!employer) {
        return this.responseFormatter.formatError(res, 404, 'Employer not found');
      }
      this.responseFormatter.formatSuccess(res, `Employer ${blocked ? 'blocked' : 'unblocked'} successfully`, employer);
    } catch (error: any) {
      this.logger.error(`AdminEmployerController toggleEmployerBlocked error for ID ${id}: ${error.message}`, error);
      next(error);
    }
  }

  //Employer verification
  verifyEmployer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return this.responseFormatter.formatError(res, 400, 'Employer ID required');
      }
      const employer = await this.adminEmployerService.verifyEmployer(id);
      if (!employer) {
        return this.responseFormatter.formatError(res, 404, 'Employer not found');
      }
      this.responseFormatter.formatSuccess(res, 'Employer verified successfully', employer);
    } catch (error: any) {
      this.logger.error(`verifyEmployer error: ${error.message}`, error);
      next(error);
    }
  }

  //Employer rejection
  rejectEmployer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { rejectionReason } = req.body;
      if (!id || !rejectionReason) {
        return this.responseFormatter.formatError(res, 400, 'Employer ID and rejection reason are required');
      }
      const employer = await this.adminEmployerService.rejectEmployer(id, rejectionReason);
      if (!employer) {
        return this.responseFormatter.formatError(res, 404, 'Employer not found');
      }
      this.responseFormatter.formatSuccess(res, 'Employer rejected successfully', employer);
    } catch (error: any) {
      this.logger.error(`rejectEmployer error: ${error.message}`, error);
      next(error);
    }
  }
}