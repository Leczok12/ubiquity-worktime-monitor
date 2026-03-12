import { Request } from 'express';
import { ApiError } from 'src/types/api-error';
import { $Enums } from '@prisma/client';

export const roleCheck = (req: Request, roles: $Enums.UserRole[]) => {
    if (!req.user) {
        throw new ApiError(401, 'UNAUTHORIZED');
    }
    roles.forEach((role) => {
        if (!req.user?.roles.includes(role)) {
            throw new ApiError(403, 'FORBIDDEN');
        }
    });
};
