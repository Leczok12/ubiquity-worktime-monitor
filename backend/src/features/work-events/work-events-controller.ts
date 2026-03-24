import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiError } from 'src/types/api-error';
import { ApiWorkerResponse } from '@shared/api-worker';
import { roleCheck } from 'src/utils/role-check';
import { pagination } from 'src/utils/pagination';
import { dateRange } from 'src/utils/date-range';
import { ApiWorkEventResponse } from '@shared/api-work-events';

export const getWorkerWorkEvents = async (req: Request, res: Response) => {
    const workerId = req.params.id as string;

    const worker = await database.prisma.worker.findUnique({
        where: { id: workerId },
    });

    if (!worker) {
        throw new ApiError(404, 'NOT_FOUND');
    }

    const { since, until } = dateRange(req);

    const workEvents = await database.prisma.workEvent.findMany({
        where: {
            AND: [{ workerId: workerId }, { timeStart: { gte: since } }, { timeEnd: { lte: until } }],
        },
        orderBy: { timeStart: 'desc' },
    });

    const response: ApiResponse<ApiWorkEventResponse> = {
        status: 'SUCCESS',
        data: {
            events: workEvents.map((event) => ({
                events: [
                    {
                        id: event.id,
                        timeStart: event.timeStart,
                        placeStart: event.placeStart ?? '',
                        timeEnd: event.timeEnd,
                        placeEnd: event.placeEnd ?? '',
                        type: event.type,
                    },
                ],
            })),
        },
    };

    res.status(200).json(response);
};
