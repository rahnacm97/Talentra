import { IAdmin } from "../users/admin/IAdmin";

export interface IUserAuthService {
  findOrCreateUser(
    role: string,
    email: string,
    name: string,
    providerId?: string,
    password?: string
  ): Promise<{ userId: string; name: string; blocked: boolean, verified?: boolean, rejectionReason?:string }>;
  findByEmail(
    email: string,
    role: string
  ): Promise<{ userId: string; name: string; password?: string; blocked?: boolean, verified?: boolean, rejectionReason?:string } | null>;
}