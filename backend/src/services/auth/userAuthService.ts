
import { IUserAuthService } from '../../interfaces/auth/IUserAuthService';
import { IUserAuthRepository } from '../../interfaces/auth/IUserAuthRepository';
import { IAdminRepository } from '../../interfaces/users/admin/IAdminRepository';
import { logger } from '../../utils/logger';

export class UserAuthService implements IUserAuthService {
  private repositories: Map<string, IUserAuthRepository>;
  private adminRepository: IAdminRepository;

  constructor(repositories: Map<string, IUserAuthRepository>, adminRepository: IAdminRepository) {
    this.repositories = repositories;
    this.adminRepository = adminRepository;
  }

  async findOrCreateUser(
    role: string,
    email: string,
    name: string,
    providerId?: string,
    password?: string
  ): Promise<{ userId: string; name: string; blocked: boolean; verified?: boolean }> {
    if (role.toLowerCase() === 'admin') {
      let user = await this.adminRepository.findByEmail(email);
      if (!user) {
        const userData: any = { email, name, password };
        try {
          user = await this.adminRepository.create(userData);
          logger.info(`Created new admin with email: ${email}`);
        } catch (error: any) {
          logger.error(`Failed to create admin with email ${email}: ${error.message}`);
          throw new Error('Failed to create admin');
        }
      }
      return { userId: user._id, name: user.name, blocked: false };
    }

    const repository = this.repositories.get(role.toLowerCase());
    if (!repository) {
      logger.error(`Invalid role: ${role}`);
      throw new Error('Invalid role');
    }

    let user = await repository.findByEmail(email);
    if (!user) {
      const userData: any = { email, name, blocked: false, verified: false }; // Default verified to false for new users
      if (providerId) userData.googleId = providerId;
      if (password) userData.password = password;
      if (role.toLowerCase() === 'candidate') {
        userData.skills = [];
        userData.experience = [];
        userData.education = [];
        userData.jobPreferences = {};
        userData.phoneNumber = '';
      } else if (role.toLowerCase() === 'employer') {
        userData.companyDescription = '';
        userData.website = '';
        userData.phoneNumber = '';
      }
      try {
        user = await repository.create(userData);
        logger.info(`Created new ${role} with email: ${email}`);
      } catch (error: any) {
        logger.error(`Failed to create ${role} with email ${email}: ${error.message}`);
        throw new Error(`Failed to create ${role}`);
      }
    } else if (providerId && user.googleId !== providerId) {
      user = await repository.update(user._id, { ...user, googleId: providerId });
      if (!user) {
        logger.error(`Failed to update googleId for ${role} with email ${email}`);
        throw new Error(`Failed to update ${role}`);
      }
      logger.info(`Updated googleId for ${role} with email: ${email}`);
    }

    return {
      userId: user._id,
      name: user.name,
      blocked: user.blocked || false,
      verified: role.toLowerCase() === 'employer' ? user.verified : undefined, 
    };
  }

  async findByEmail(
    email: string,
    role: string
  ): Promise<{ userId: string; name: string; password?: string; blocked?: boolean; verified?: boolean } | null> {
    if (role.toLowerCase() === 'admin') {
      const user = await this.adminRepository.findByEmail(email);
      if (!user) {
        logger.info(`No admin found with email: ${email}`);
        return null;
      }
      return {
        userId: user._id,
        name: user.name,
        password: user.password,
        blocked: false, 
      };
    }

    const repository = this.repositories.get(role.toLowerCase());
    if (!repository) {
      logger.error(`Invalid role: ${role}`);
      throw new Error('Invalid role');
    }

    const user = await repository.findByEmail(email);
    if (!user) {
      logger.info(`No ${role} found with email: ${email}`);
      return null;
    }

    return {
      userId: user._id,
      name: user.name,
      password: user.password,
      blocked: user.blocked,
      verified: role.toLowerCase() === 'employer' ? user.verified : undefined, 
    };
  }
}