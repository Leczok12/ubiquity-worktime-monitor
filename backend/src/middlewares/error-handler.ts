import { ApiResponse } from '@shared/api-response';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from 'src/types/api-error';
import { log } from 'src/utils/log';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const response: { json: ApiResponse<undefined>; code: number } = (() => {
        if (err instanceof ApiError) {
            return { json: { status: 'ERROR', message: err.message }, code: err.statusCode };
        }
        return { json: { status: 'ERROR', message: 'Unknown error' }, code: 500 };
    })();

    log(`${response.json.message}`, 'ERROR');
    res.status(response.code).json(response.json);
};

export default errorHandler;
