import { ApiAuthConfig, ApiAuthUser } from '@shared/types/api/api-auth';
import { ApiResponse } from '@sharedtypes/api-response';
import { ENV } from '@src/config/enviroment';
import { ApiError } from '@src/types/api-error';
import { Request, Response } from 'express';

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

    const logout: (req: Request, res: Response) => Promise<void> = async (
        req: Request,
        res: Response
    ) => {
        if (!req.isAuthenticated())
            throw new ApiError(401, 'UNAUTHORIZED', 'User is not authenticated');

        req.session.destroy(() => {
            res.clearCookie('connect.sid');

            const response: ApiResponse<undefined> = {
                status: 'SUCCESS',
            };
            res.status(200).json(response);
        });
    };

    return { getConfig, getUser, logout };
};

export { authController };
