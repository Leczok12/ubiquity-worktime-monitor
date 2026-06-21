import { logger } from '@shared/utils/logger';
import { NextFunction, Request, Response } from 'express';

export default function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
    logger.middleware(req.method, req.url, req.ip, req.user?.email);
    next();
}
