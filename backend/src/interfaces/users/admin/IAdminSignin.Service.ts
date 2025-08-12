export interface IAdminSigninService {
    signin(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        role: string;
        name: string;
        userId: string;
    } | null>;
}