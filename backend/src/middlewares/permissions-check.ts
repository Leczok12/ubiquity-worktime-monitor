import { NextFunction, Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';

const permissionCheck = (role: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(401, 'UNAUTHORIZED');
        }
        const userRoles = req.user?.roles;

        switch (role) {
            case 'SYSTEM_ADMIN':
                if (!userRoles.includes('SYSTEM_ADMIN')) {
                    throw new ApiError(403, 'FORBIDDEN');
                }
                break;
            case 'MANAGER':
                if (!userRoles.includes('MANAGER') && !userRoles.includes('SYSTEM_ADMIN')) {
                    throw new ApiError(403, 'FORBIDDEN');
                }
                break;
            case 'VIEWER':
                if (
                    !userRoles.includes('VIEWER') &&
                    !userRoles.includes('MANAGER') &&
                    !userRoles.includes('SYSTEM_ADMIN')
                ) {
                    throw new ApiError(403, 'FORBIDDEN');
                }
                break;
            case 'WORKER':
                if (
                    !userRoles.includes('WORKER') &&
                    !userRoles.includes('MANAGER') &&
                    !userRoles.includes('SYSTEM_ADMIN') &&
                    !userRoles.includes('VIEWER')
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
