import { $Enums } from '@prisma/client';
import { ApiError } from '@src/types/api-error';
import { Request } from 'express';

export const authorizer = (req: Request, role: $Enums.UserRole) => {
    if (!req.isAuthenticated() || !req.user)
        throw new ApiError(401, 'UNAUTHORIZED', 'User is not authenticated');

    const userRole = req.user?.role;

    switch (role) {
        case 'SYSTEM_ADMIN':
            if (userRole !== 'SYSTEM_ADMIN') {
                throw new ApiError(403, 'FORBIDDEN', 'User does not have sufficient permissions');
            }
            break;
        case 'MANAGER':
            if (userRole !== 'MANAGER' && userRole !== 'SYSTEM_ADMIN') {
                throw new ApiError(403, 'FORBIDDEN', 'User does not have sufficient permissions');
            }
            break;
        case 'VIEWER':
            if (userRole !== 'VIEWER' && userRole !== 'MANAGER' && userRole !== 'SYSTEM_ADMIN') {
                throw new ApiError(403, 'FORBIDDEN', 'User does not have sufficient permissions');
            }
            break;
        case 'WORKER':
            if (
                userRole !== 'WORKER' &&
                userRole !== 'MANAGER' &&
                userRole !== 'SYSTEM_ADMIN' &&
                userRole !== 'VIEWER'
            ) {
                throw new ApiError(403, 'FORBIDDEN', 'User does not have sufficient permissions');
            }
            break;
        default:
            throw new ApiError(403, 'FORBIDDEN', 'User does not have sufficient permissions');
    }
};
