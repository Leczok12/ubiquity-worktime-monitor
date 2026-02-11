import { Request, Response, NextFunction } from 'express';
import { log } from 'src/utils/log';

const logger = (req: Request, res: Response, next: NextFunction) => {
    log(`${req.method} ${req.url}`, 'INFO');
    next();
};

export default logger;
