export interface IUserService {
  getUserByEmail(role: string, email: string): Promise<any | null>;
  createUser(data: { email: string; password: string; name: string; phoneNumber: string; role: string }): Promise<any>;
}