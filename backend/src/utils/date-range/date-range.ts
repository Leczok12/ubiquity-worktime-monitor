import { Request } from 'express';
import { ApiError } from 'src/types/api-error';

export const dateRange = (req: Request) => {
    const rawSince = parseInt((req.query.since as string | undefined) ?? '-1');
    const rawUntil = parseInt((req.query.until as string | undefined) ?? '-1');

    if (rawSince < 0 || rawUntil < 0 || rawSince > rawUntil) {
        throw new ApiError(400, 'INVALID_ARGS');
    }

    const since = new Date(rawSince * 1000);
    const until = new Date(rawUntil * 1000);

    if (until.getTime() - since.getTime() > 1000 * 60 * 60 * 24 * 60) {
        throw new ApiError(400, 'INVALID_ARGS', 'Date range cannot be longer than 60 days');
    }

    return {
        since,
        until,
    };
};
