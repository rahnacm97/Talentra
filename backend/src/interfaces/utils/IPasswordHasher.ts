export interface IPasswordHasher {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
  comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}