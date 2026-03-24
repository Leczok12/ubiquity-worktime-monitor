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

/**
 * Calculates work seconds for a day, accounting for overlapping breaks.
 * Finds intersection between work periods and breaks, then subtracts overlapping parts.
 */
const calculateWorkSecondsWithBreaks = (events: { timeStart: Date; timeEnd: Date; type: string }[]): number => {
    const workEvents = events.filter((e) => e.type === 'WORK');
    const breakEvents = events.filter((e) => e.type === 'BREAK');

    if (workEvents.length === 0) return 0;

    // Calculate total work time
    let totalWorkSeconds = workEvents.reduce((acc, event) => {
        return acc + Math.floor((event.timeEnd.getTime() - event.timeStart.getTime()) / 1000);
    }, 0);

    // Subtract overlapping break time
    const overlappingBreakSeconds = breakEvents.reduce((acc, breakEvent) => {
        // Find overlaps with all work events
        const breakOverlap = workEvents.reduce((breakAcc, workEvent) => {
            const overlapStart = Math.max(workEvent.timeStart.getTime(), breakEvent.timeStart.getTime());
            const overlapEnd = Math.min(workEvent.timeEnd.getTime(), breakEvent.timeEnd.getTime());

            if (overlapStart < overlapEnd) {
                breakAcc += Math.floor((overlapEnd - overlapStart) / 1000);
            }
            return breakAcc;
        }, 0);

        return acc + breakOverlap;
    }, 0);

    return Math.max(0, totalWorkSeconds - overlappingBreakSeconds);
};

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
            seconds: 0,
            days: (() => {
                const days: ApiWorkDay[] = [];

                let currentDay = new Date(since);
                while (currentDay.getTime() < until.getTime()) {
                    days.push({
                        seconds: 0,
                        dayEnd: new Date(currentDay.getTime() + 24 * 60 * 60 * 1000),
                        dayStart: new Date(currentDay),
                        events: [],
                    });
                    currentDay = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000);
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

        // Calculate work seconds accounting for overlapping breaks
        day.seconds = calculateWorkSecondsWithBreaks(day.events);
    }
    response.data.seconds = response.data.days.reduce((acc, day) => acc + day.seconds, 0);

    res.status(200).json(response);
};
