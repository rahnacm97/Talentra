
export interface IUserAuthRepository {
  findByEmail(email: string): Promise<{ _id: string; name: string; googleId?: string; password?: string; blocked?: boolean; verified?: boolean; rejectionReason?: string} | null>;
  create(data: any): Promise<{ _id: string; name: string; googleId?: string; password?: string; blocked: boolean; verified?: boolean; rejectionReason?: string}>;
  update(id: string, data: any): Promise<{ _id: string; name: string; googleId?: string; password?: string; blocked: boolean; verified?: boolean; rejectionReason?: string} | null>;
}