export interface IAdminLogout{
    logout(refreshToken: string): Promise<void>;
}