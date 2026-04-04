import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiError } from 'src/types/api-error';
import { workEventsDateRange } from 'src/utils/work-events-date-range';
import {
    ApiCreateWorkEventRequest,
    ApiGetWorkerWorkEventsResponse,
    ApiUpdateWorkEventRequest,
    ApiWorkDay,
} from '@shared/api-work-events';
import { config } from 'src/services/config';
import { $Enums } from '@prisma/client';
import z from 'zod';
import { workEventsToSeconds } from 'src/utils/work-events-to-seconds';

/* Get Worker Work Events */

export const getWorkerWorkEvents = async (req: Request, res: Response) => {
    const rawWorkerId = req.params.workerId as string;
    const workerId = rawWorkerId === undefined ? req.user?.id : rawWorkerId;

    const worker = await database.prisma.worker.findUnique({
        where: { id: workerId, sync: true },
    });

    if (!worker) throw new ApiError(404, 'NOT_FOUND');

    const [h, m, s] = (await config.getValue('UBIQUITI_ACCESS_END_WORK_DAY')).split(':').map(Number);
    const { since, until } = workEventsDateRange(req);
    since.setHours(h, m, s);
    until.setHours(h, m, s);

    const response: ApiResponse<ApiGetWorkerWorkEventsResponse> = {
        status: 'SUCCESS',
        data: {
            seconds: 0,
            days: (() => {
                const days: ApiWorkDay[] = [];

                let currentDay = new Date(since);

                while (currentDay.getTime() < until.getTime()) {
                    const nextDay = new Date(currentDay);
                    nextDay.setDate(nextDay.getDate() + 1);

                    days.push({
                        seconds: 0,
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

    if (!response.data) throw new ApiError(500, 'ERROR');

    for (const day of response.data.days) {
        const workEvents = await database.prisma.workEvent.findMany({
            where: {
                AND: [
                    { workerId: workerId },
                    { timeStart: { gt: day.dayStart } },
                    { timeEnd: { lte: day.dayEnd } },
                    { isDeleted: { equals: false } },
                ],
            },
            orderBy: { timeStart: 'desc' },
        });

        day.events = workEvents
            .map((event) => {
                return {
                    id: event.id,
                    timeStart: event.timeStart.toISOString(),
                    placeStart: event.placeStart ?? undefined,
                    timeEnd: event.timeEnd.toISOString(),
                    placeEnd: event.placeEnd ?? undefined,
                    type: event.type,
                };
            })
            .sort((a, b) => new Date(b.timeEnd).getTime() - new Date(a.timeEnd).getTime());

        day.seconds = workEventsToSeconds(day.events);
        response.data.seconds += day.seconds;
    }

    return res.status(200).json(response);
};

/* Create Work Event */

const createWorkerWorkEventSchema: z.Schema<ApiCreateWorkEventRequest> = z.object({
    timeStart: z.iso.datetime(),
    placeStart: z.string().optional(),
    timeEnd: z.iso.datetime(),
    placeEnd: z.string().optional(),
    type: z.enum($Enums.WorkEventType),
});

export const createWorkerWorkEvent = async (req: Request, res: Response) => {
    const workerId = req.params.workerId as string;
    const data = createWorkerWorkEventSchema.safeParse(req.body);

    if (data.success === false)
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    const worker = await database.prisma.worker.findUnique({
        where: { id: workerId, sync: true },
    });

    if (!worker || !worker.sync) throw new ApiError(404, 'NOT_FOUND');

    const [h, m, s] = (await config.getValue('UBIQUITI_ACCESS_END_WORK_DAY')).split(':').map(Number);

    const reqStart = new Date(data.data.timeStart);
    const reqEnd = new Date(data.data.timeEnd);

    const DayEnd = new Date(new Date(reqEnd).setHours(h, m, s, 0));
    const DayStart = new Date(new Date(DayEnd).setDate(DayEnd.getDate() - 1));

    if (
        reqStart.getTime() <= DayStart.getTime() ||
        reqStart.getTime() >= DayEnd.getTime() ||
        reqEnd.getTime() < DayStart.getTime() ||
        reqEnd.getTime() > DayEnd.getTime() ||
        reqStart.getTime() >= reqEnd.getTime()
    )
        throw new ApiError(400, 'INVALID_ARGS', 'Invalid date range');

    await database.prisma.workEvent.create({
        data: {
            workerId: workerId,
            timeStart: data.data.timeStart,
            placeStart: data.data.placeStart ?? null,
            timeEnd: data.data.timeEnd,
            placeEnd: data.data.placeEnd ?? null,
            type: data.data.type,

            lastModified: new Date(),
            lastModifiedByUserId: req.user?.id ?? null,
        },
    });

    const response: ApiResponse<null> = {
        status: 'SUCCESS',
    };

    res.status(200).json(response);
};

/* Update Work Event */

const updateWorkEventSchema: z.Schema<ApiUpdateWorkEventRequest> = z.object({
    timeStart: z.iso.datetime(),
    placeStart: z.string().optional(),
    timeEnd: z.iso.datetime(),
    placeEnd: z.string().optional(),
    type: z.enum($Enums.WorkEventType),
});

export const updateWorkEvent = async (req: Request, res: Response) => {
    const workEventId = req.params.workEventId as string;
    const data = updateWorkEventSchema.safeParse(req.body);

    if (data.success === false)
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    const oldWorkEvent = await database.prisma.workEvent.findUnique({
        where: { id: workEventId },
    });

    if (!oldWorkEvent || oldWorkEvent.isDeleted) throw new ApiError(404, 'NOT_FOUND');

    const [h, m, s] = (await config.getValue('UBIQUITI_ACCESS_END_WORK_DAY')).split(':').map(Number);

    const oldDayEnd = new Date(new Date(oldWorkEvent.timeEnd).setHours(h, m, s, 0));
    const oldDayStart = new Date(new Date(oldDayEnd).setDate(oldDayEnd.getDate() - 1));
    const reqStart = new Date(data.data.timeStart);
    const reqEnd = new Date(data.data.timeEnd);

    if (
        reqStart.getTime() <= oldDayStart.getTime() ||
        reqStart.getTime() >= oldDayEnd.getTime() ||
        reqEnd.getTime() < oldDayStart.getTime() ||
        reqEnd.getTime() > oldDayEnd.getTime() ||
        reqStart.getTime() >= reqEnd.getTime()
    )
        throw new ApiError(400, 'INVALID_ARGS', 'Invalid date range');

    await database.prisma.workEvent.update({
        where: { id: workEventId },
        data: {
            timeStart: data.data.timeStart,
            placeStart: data.data.placeStart ?? null,
            timeEnd: data.data.timeEnd,
            placeEnd: data.data.placeEnd ?? null,
            type: data.data.type,

            lastModified: new Date(),
            lastModifiedByUserId: req.user?.id ?? null,
        },
    });

    const response: ApiResponse<null> = {
        status: 'SUCCESS',
    };

    res.status(200).json(response);
};

/* Delete Work Event */

export const deleteWorkEvent = async (req: Request, res: Response) => {
    const workEventId = req.params.workEventId as string;

    const { count } = await database.prisma.workEvent.updateMany({
        where: { AND: [{ id: workEventId, isDeleted: false }] },
        data: {
            isDeleted: true,

            lastModified: new Date(),
            lastModifiedByUserId: req.user?.id ?? null,
        },
    });

    if (count === 0) throw new ApiError(404, 'NOT_FOUND');

    const response: ApiResponse<null> = {
        status: 'SUCCESS',
    };

    res.status(200).json(response);
};
