import { Request } from 'express';
import { ApiError } from 'src/types/api-error';
import { $Enums } from '@prisma/client';

export const roleCheck = (req: Request, role: $Enums.UserRole) => {
    if (!req.user) {
        throw new ApiError(401, 'UNAUTHORIZED');
    }

    switch (role) {
        case 'SYSTEM_ADMIN':
            if (!req.user.roles.includes('SYSTEM_ADMIN')) {
                throw new ApiError(403, 'FORBIDDEN');
            }
            break;
        case 'MANAGER':
            if (!req.user.roles.includes('MANAGER') || !req.user.roles.includes('SYSTEM_ADMIN')) {
                throw new ApiError(403, 'FORBIDDEN');
            }
            break;
        case 'VIEWER':
            if (
                !req.user.roles.includes('VIEWER') ||
                !req.user.roles.includes('MANAGER') ||
                !req.user.roles.includes('SYSTEM_ADMIN')
            ) {
                throw new ApiError(403, 'FORBIDDEN');
            }
            break;
        case 'WORKER':
            if (
                !req.user.roles.includes('WORKER') ||
                !req.user.roles.includes('MANAGER') ||
                !req.user.roles.includes('SYSTEM_ADMIN') ||
                !req.user.roles.includes('VIEWER')
            ) {
                throw new ApiError(403, 'FORBIDDEN');
            }
            break;
    }
};
