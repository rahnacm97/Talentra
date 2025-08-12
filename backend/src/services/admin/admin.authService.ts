import bcrypt from 'bcryptjs'
import { IAdminSigninService } from '../../interfaces/users/admin/IAdminSignin.Service';
import { IAdminRepository } from '../../interfaces/users/admin/IAdminRepository';
import { IAuthRepository } from '../../interfaces/auth/IAuth.Repository';
import { IJwtService } from '../../interfaces/utils/IJwt.Service';
import { IAuthResponse } from '../../interfaces/auth/IAuthResponse';

export class AdminAuthService implements IAdminSigninService{
  constructor(
    private adminRepository: IAdminRepository,
    private authRepository: IAuthRepository,
    private jwtService: IJwtService,
  ){}

  async signin(email: string, password: string): Promise<IAuthResponse | null>{

    const admin = await this.adminRepository.findByEmail(email);
    if(!admin){
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if(!isPasswordValid){
      return null;
    } 

    const userId = admin._id!.toString();
    const tokenPayload = { userId, role:'admin'};
    const accessToken = this.jwtService.generateToken(tokenPayload);

    const refreshPayload = { userId, role: 'admin' };
    const refreshToken = this.jwtService.generateRefreshToken(refreshPayload);

    const blocked = false;

    await this.authRepository.saveRefreshToken(userId, refreshToken);
    return {
      accessToken,
      refreshToken,
      role: 'admin',
      name: admin.name,
      userId,
      blocked,
    };

  }
}
