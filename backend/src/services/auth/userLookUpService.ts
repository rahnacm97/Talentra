import { IUserRepository } from '../../interfaces/users/IUserRepository';
import { logger } from '../../utils/logger';

export interface IUserLookupService {
  findByEmail(email: string): Promise<{ user: any; role: string } | null>;
  update(id: string, role: string, data: any): Promise<any | null>;
}

export class UserLookupService implements IUserLookupService {
  private userRepositories: Map<string, IUserRepository>;

  constructor(userRepositories: Map<string, IUserRepository>) {
    this.userRepositories = userRepositories;
  }

  async findByEmail(email: string): Promise<{ user: any; role: string } | null> {
    for (const [role, repository] of this.userRepositories.entries()) {
      const user = await repository.findByEmail(email);
      if (user) {
        if (!user._id) {
          logger.error(`findByEmail: User with email ${email} in ${role} repository has no _id`);
          throw new Error('Invalid user data: missing ID');
        }
        logger.info(`findByEmail: Found user with email ${email} in ${role} repository`);
        return { user, role };
      }
    }
    logger.warn(`findByEmail: No user found with email ${email}`);
    return null;
  }

  async update(id: string, role: string, data: any): Promise<any | null> {
    const repository = this.userRepositories.get(role.toLowerCase());
    if (!repository) {
      logger.error(`update: Invalid user role ${role} for ID ${id}`);
      throw new Error('Invalid user role');
    }
    const updatedUser = await repository.update(id, data);
    if (!updatedUser) {
      logger.error(`update: Failed to update user with ID ${id} in ${role} repository`);
      throw new Error('Failed to update user');
    }
    logger.info(`update: User with ID ${id} updated successfully in ${role} repository`);
    return updatedUser;
  }
}