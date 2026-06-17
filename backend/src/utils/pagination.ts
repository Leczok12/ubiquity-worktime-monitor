import { Request } from 'express';
import { ApiError } from '@src/types/api-error';

export const pagination = (req: Request) => {
    const pageNumber = parseInt((req.query.pageNumber as string | undefined) ?? '1');
    const pageSize = parseInt((req.query.pageSize as string | undefined) ?? '9999');

    if (pageNumber < 1 || pageSize < 1) {
        throw new ApiError(400, 'INVALID_ARGS');
    }

    return {
        pageNumber,
        pageSize,
    };
};
