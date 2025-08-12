export interface IUserLookupService {
  findByEmail(email: string): Promise<{ user: any; role: string } | null>;
  update(id: string, role: string, data: any): Promise<any | null>;
}