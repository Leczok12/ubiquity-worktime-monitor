import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiError } from 'src/types/api-error';
import { ApiWorkerResponse } from '@shared/api-worker';
import { roleCheck } from 'src/utils/role-check';
import { pagination } from 'src/utils/pagination';
import { dateRange } from 'src/utils/date-range';
import { ApiWorkDay, ApiWorkEventRequest, ApiWorkEventsResponse } from '@shared/api-work-events';
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
                        dayEnd: new Date(nextDay).toISOString(),
                        dayStart: new Date(currentDay).toISOString(),
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
                AND: [
                    { workerId: workerId },
                    { timeStart: { gte: day.dayStart } },
                    { timeEnd: { lte: day.dayEnd } },
                    { isDeleted: { equals: false } },
                ],
            },
            orderBy: { timeStart: 'desc' },
        });

        workEvents.forEach((event) => {
            day.events.push({
                id: event.id,
                timeStart: event.timeStart.toISOString(),
                placeStart: event.placeStart ?? '',
                timeEnd: event.timeEnd.toISOString(),
                placeEnd: event.placeEnd ?? '',
                type: event.type,
            });
        });

        day.events.sort((a, b) => new Date(a.timeStart).getTime() - new Date(b.timeStart).getTime());
    }

    res.status(200).json(response);
};

export const deleteWorkEvent = async (req: Request, res: Response) => {
    const workEventId = req.params.id as string;

    const xd = await database.prisma.workEvent.updateMany({
        where: { id: workEventId, isDeleted: false },
        data: { isDeleted: true },
    });

    if (xd.count === 0) {
        throw new ApiError(404, 'NOT_FOUND', 'Work event not exists');
    }

    const response: ApiResponse<null> = {
        status: 'SUCCESS',
    };

    res.status(200).json(response);
};

export const updateWorkEvent = async (req: Request, res: Response) => {
    const data = req.body as ApiWorkEventRequest;
    data.id = req.params.id as string;

    if (
        data.id === undefined ||
        data.timeStart === undefined ||
        data.timeEnd === undefined ||
        data.type === undefined
    ) {
        throw new ApiError(400, 'INVALID_ARGS', 'Missing required fields');
    }

    const oldWorkEvent = await database.prisma.workEvent.findUnique({
        where: { id: data.id },
    });

    if (!oldWorkEvent || oldWorkEvent.isDeleted) {
        throw new ApiError(404, 'NOT_FOUND');
    }

    const [h, m, s] = (await config.getValue('UBIQUITI_ACCESS_END_WORK_DAY')).split(':').map(Number);
    const oldDayEnd = new Date(new Date(oldWorkEvent.timeStart).setHours(h, m, s, 0));
    const oldDayBegin = new Date(new Date(oldDayEnd).setDate(oldDayEnd.getDate() - 1));

    if (
        new Date(data.timeStart).getTime() < oldDayBegin.getTime() ||
        new Date(data.timeStart).getTime() > oldDayEnd.getTime() ||
        new Date(data.timeEnd).getTime() < oldDayBegin.getTime() ||
        new Date(data.timeEnd).getTime() > oldDayEnd.getTime() ||
        new Date(data.timeStart).getTime() >= new Date(data.timeEnd).getTime()
    ) {
        throw new ApiError(400, 'INVALID_ARGS', 'Invalid time range');
    }

    await database.prisma.workEvent.update({
        where: { id: data.id },
        data: {
            timeStart: new Date(data.timeStart),
            timeEnd: new Date(data.timeEnd),
            type: data.type,
        },
    });

    const response: ApiResponse<null> = {
        status: 'SUCCESS',
    };

    res.status(200).json(response);
};

export const createWorkEvent = async (req: Request, res: Response) => {
    const data = req.body as ApiWorkEventRequest;

    if (
        data.workerId === undefined ||
        data.timeStart === undefined ||
        data.timeEnd === undefined ||
        data.type === undefined
    ) {
        throw new ApiError(400, 'INVALID_ARGS');
    }

    const xd = await database.prisma.workEvent.updateMany({
        where: { id: workEventId, isDeleted: false },
        data: { isDeleted: true },
    });

    if (xd.count === 0) {
        throw new ApiError(404, 'NOT_FOUND', 'Work event not exists');
    }

    const response: ApiResponse<null> = {
        status: 'SUCCESS',
    };

    res.status(200).json(response);
};
