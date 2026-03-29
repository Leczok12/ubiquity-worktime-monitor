import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiError } from 'src/types/api-error';
import { ApiWorkerResponse } from '@shared/api-worker';
import { roleCheck } from 'src/utils/role-check';
import { pagination } from 'src/utils/pagination';
import { dateRange } from 'src/utils/date-range';
import { ApiWorkDay, ApiWorkEventsResponse } from '@shared/api-work-events';
import { config } from 'src/services/config';

export const getWorkerWorkEvents = async (req: Request, res: Response) => {
    const workerId = req.params.id as string;

    const worker = await database.prisma.worker.findUnique({
        where: { id: workerId },
    });

    if (!worker) {
        throw new ApiError(404, 'NOT_FOUND');
    }

    const { since, until } = dateRange(req);
    const [h, m, s] = (await config.getValue('UBIQUITI_ACCESS_END_WORK_DAY')).split(':').map(Number);
    since.setHours(h, m, s);
    until.setHours(h, m, s);

    if (since.getTime() === until.getTime()) {
        throw new ApiError(400, 'INVALID_ARGS', 'Since and until cannot be the same');
    }

    const response: ApiResponse<ApiWorkEventsResponse> = {
        status: 'SUCCESS',
        data: {
            days: (() => {
                const days: ApiWorkDay[] = [];

                let currentDay = new Date(since);

                while (currentDay.getTime() < until.getTime()) {
                    const nextDay = new Date(currentDay);
                    nextDay.setDate(nextDay.getDate() + 1);

                    days.push({
                        dayEnd: new Date(nextDay),
                        dayStart: new Date(currentDay),
                        events: [],
                    });

                    currentDay = new Date(nextDay);
                }

                return days.reverse();
            })(),
        },
    };

    if (!response.data) {
        throw new ApiError(500, 'ERROR', 'Failed to fetch work events');
    }

    for (const day of response.data.days) {
        const workEvents = await database.prisma.workEvent.findMany({
            where: {
                AND: [{ workerId: workerId }, { timeStart: { gte: day.dayStart } }, { timeEnd: { lte: day.dayEnd } }],
            },
            orderBy: { timeStart: 'desc' },
        });

        workEvents.forEach((event) => {
            day.events.push({
                id: event.id,
                timeStart: event.timeStart,
                placeStart: event.placeStart ?? '',
                timeEnd: event.timeEnd,
                placeEnd: event.placeEnd ?? '',
                type: event.type,
            });
        });

        day.events.sort((a, b) => a.timeStart.getTime() - b.timeStart.getTime());
    }

    res.status(200).json(response);
};
