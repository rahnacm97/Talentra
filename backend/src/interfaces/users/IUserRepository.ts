export interface IUserRepository {
  findByEmail(email: string): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any | null>;
}