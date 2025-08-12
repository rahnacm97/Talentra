import { Request, Response, NextFunction } from "express";
import { IResponseFormatter } from "../../interfaces/response/IResponseFormatter";
import { IAdminSigninService } from "../../interfaces/users/admin/IAdminSignin.Service";
import { IAdminLogout } from "../../interfaces/users/admin/IAdminLogout.Service";

export class AdminController {
  constructor(
    private adminSigninService: IAdminSigninService,
    private logoutService: IAdminLogout,
    private responseFormatter: IResponseFormatter
  ) {}

  // Admin signin Controller
  signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const adminResponse = await this.adminSigninService.signin(email, password);
      if (!adminResponse) {
        return this.responseFormatter.formatError(res, 401, "Invalid Admin Credentials");
      }

      this.responseFormatter.formatSuccess(res, "Sign in successful", {
        token: adminResponse.accessToken,
        refreshToken: adminResponse.refreshToken,
        role: adminResponse.role,
        name: adminResponse.name,
        userId: adminResponse.userId,
      });
    } catch (error: any) {
      next(error);
    }
  };

  // Admin logout Controller
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      await this.logoutService.logout(refreshToken);
      this.responseFormatter.formatSuccess(res, "Logged out successfully", null);
    } catch (error: any) {
      next(error);
    }
  };
}