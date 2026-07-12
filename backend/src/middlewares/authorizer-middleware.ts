import { $Enums } from '@prisma/client';
import { authorizer } from '@src/utils/authorizer';
import { NextFunction, Request, Response } from 'express';

export const authorizerMiddleware = (role: $Enums.UserRole) => {
    return (req: Request, res: Response, next: NextFunction) => {
        authorizer(req, role);
        next();
    };
};
