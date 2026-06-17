import { NextFunction, Request, Response } from 'express';
import { ApiError } from '@src/types/api-error';

const permissionCheck = (role?: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!role && !!req.user) {
            next();
            return;
        }

        if (!req.user) {
            throw new ApiError(401, 'UNAUTHORIZED');
        }
        const userRole = req.user?.role;

        switch (role) {
            case 'SYSTEM_ADMIN':
                if (userRole !== 'SYSTEM_ADMIN') {
                    throw new ApiError(403, 'FORBIDDEN');
                }
                break;
            case 'MANAGER':
                if (userRole !== 'MANAGER' && userRole !== 'SYSTEM_ADMIN') {
                    throw new ApiError(403, 'FORBIDDEN');
                }
                break;
            case 'VIEWER':
                if (userRole !== 'VIEWER' && userRole !== 'MANAGER' && userRole !== 'SYSTEM_ADMIN') {
                    throw new ApiError(403, 'FORBIDDEN');
                }
                break;
            case 'WORKER':
                if (
                    userRole !== 'WORKER' &&
                    userRole !== 'MANAGER' &&
                    userRole !== 'SYSTEM_ADMIN' &&
                    userRole !== 'VIEWER'
                ) {
                    throw new ApiError(403, 'FORBIDDEN');
                }
                break;
            default:
                throw new ApiError(403, 'FORBIDDEN');
        }
        next();
    };
};

export default permissionCheck;
