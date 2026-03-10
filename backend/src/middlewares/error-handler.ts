import { ApiResponse } from '@shared/api-response';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';
import { logger } from '../utils/logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        logger.error(err.message || err.status);
        res.status(err.statusCode).json({ status: err.status, errorMessage: err.message } as ApiResponse<undefined>);
    } else if (err instanceof Error) {
        logger.error(err.message);
        res.status(500).json({ status: 'ERROR', errorMessage: err.message } as ApiResponse<undefined>);
    } else {
        logger.error('Internal Server Error');
        res.status(500).json({ status: 'ERROR', errorMessage: 'Internal Server Error' } as ApiResponse<undefined>);
    }
};

export default errorHandler;
