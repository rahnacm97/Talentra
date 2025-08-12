import { IEmployer } from "../employer/IEmployer";

export interface IAdminEmployerService {
    getAllEmployers(page: number, limit: number, search: string): Promise<{ data: IEmployer[]; total: number }>;
    getEmployerById(id: string): Promise<IEmployer | null>;
    toggleEmployerBlocked(id: string, blocked: boolean): Promise<IEmployer | null>;
    verifyEmployer(id: string): Promise<IEmployer | null>;
    rejectEmployer(id: string, rejectionReason: string): Promise<IEmployer | null>;
}