import { ApiResponse } from '@shared/api-response';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';
import { log } from 'src/utils/log';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        log(err.message || err.status, 'ERROR');
        res.status(err.statusCode).json({ status: err.status, errorMessage: err.message } as ApiResponse<undefined>);
    } else if (err instanceof Error) {
        log(err.message, 'ERROR');
        res.status(500).json({ status: 'ERROR', errorMessage: err.message } as ApiResponse<undefined>);
    } else {
        log('Internal Server Error', 'ERROR');
        res.status(500).json({ status: 'ERROR', errorMessage: 'Internal Server Error' } as ApiResponse<undefined>);
    }
};

export default errorHandler;
