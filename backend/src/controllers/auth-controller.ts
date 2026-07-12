import { ApiAuthConfig, ApiAuthUser } from '@shared/types/api/api-auth';
import { ENV } from '@src/config/enviroment';
import { ApiError } from '@src/types/api-error';
import { Request } from 'express';

const authController = () => {
    const getConfig: () => Promise<ApiAuthConfig> = async () => {
        return {
            microsoft: {
                enabled: ENV.MICROSOFT_ENABLED,
                loginLabel: ENV.MICROSOFT_LOGIN_LABEL,
            },
            google: {
                enabled: ENV.GOOGLE_ENABLED,
                loginLabel: ENV.GOOGLE_LOGIN_LABEL,
            },
        };
    };

    const getUser: (req: Request) => Promise<ApiAuthUser> = async (req: Request) => {
        if (!req.isAuthenticated())
            throw new ApiError(401, 'UNAUTHORIZED', 'User is not authenticated');

        return {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            lastname: req.user.lastname,
            role: req.user.role,
            workerId: req.user.workerId || undefined,
        };
    };

    return { getConfig, getUser };
};

export { authController };
