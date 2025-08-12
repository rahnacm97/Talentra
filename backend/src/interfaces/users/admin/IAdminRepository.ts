import { IAdmin  } from "./IAdmin";

export interface IAdminRepository{
    findById(id: string): Promise<IAdmin| null>;
    findByEmail(email: string): Promise<IAdmin | null>;
    create(adminData: Partial<IAdmin>): Promise<IAdmin>;
}