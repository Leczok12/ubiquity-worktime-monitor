import {
    ApiCreateWorkEvent,
    ApiGetWorkEvent,
    ApiGetWorkEventGrouped,
    ApiUpdateWorkEvent,
} from '@shared/types/api/api-work-event';
import { ENV } from '../config/enviroment';
import { randomInt } from 'node:crypto';
import { database } from '@src/config/database';
import { calculateWorkTimeInMinutes } from '@src/utils/calculate-work-time-in-minutes';

const workEventController = () => {
    const createWorkEvent: (
        workerId: string,
        data: ApiCreateWorkEvent,
        userId?: string
    ) => Promise<void> = async (workerId, data, userId) => {
        const worker = await database.prisma.worker.findUnique({
            where: { id: workerId },
        });

        if (!worker) {
            throw new Error(`Worker with ID ${workerId} not found`);
        }

        await database.prisma.workEvent.create({
            data: {
                id: data.id ?? undefined,
                type: data.type,
                timeStart: new Date(data.sinceDate),
                timeEnd: new Date(data.untilDate),
                placeStart: data.placeStart ?? undefined,
                placeEnd: data.placeEnd ?? undefined,
                workerId: workerId,
                lastModifiedByUserId: userId,
                lastModified: new Date(),
            },
        });
    };

    const getWorkEvents: (
        workerId: string,
        sinceDate: Date,
        untilDate: Date
    ) => Promise<ApiGetWorkEvent[]> = async (
        workerId: string,
        sinceDate: Date,
        untilDate: Date
    ) => {
        const workEvents = await database.prisma.workEvent.findMany({
            where: {
                AND: [
                    { workerId: workerId },
                    { isDeleted: false },
                    {
                        timeStart: {
                            lte: untilDate,
                        },
                    },
                    {
                        timeEnd: {
                            gte: sinceDate,
                        },
                    },
                ],
            },
        });

        return workEvents.map((event) => ({
            sinceDate: event.timeStart.toISOString(),
            untilDate: event.timeEnd.toISOString(),
            type: event.type,
            id: event.id,
            placeStart: event.placeStart ?? undefined,
            placeEnd: event.placeEnd ?? undefined,
        }));
    };

    const getWorkEventsGrouped: (
        workerId: string,
        sinceDate: Date,
        untilDate: Date
    ) => Promise<ApiGetWorkEventGrouped[]> = async (
        workerId: string,
        sinceDate: Date,
        untilDate: Date
    ) => {
        const data: ApiGetWorkEventGrouped[] = [];

        const calculatedUntilDate = new Date(untilDate);
        calculatedUntilDate.setHours(24, 0, 0, 0);
        calculatedUntilDate.setMinutes(calculatedUntilDate.getMinutes() + ENV.END_OF_DAY_OFFSET);

        const calculatedSinceDate = new Date(sinceDate);
        calculatedSinceDate.setHours(0, 0, 0, 0);
        calculatedSinceDate.setMinutes(calculatedSinceDate.getMinutes() + ENV.END_OF_DAY_OFFSET);

        // Create empty groups for each day in the range
        while (calculatedSinceDate < calculatedUntilDate) {
            const currentSince = new Date(calculatedSinceDate);
            const currentUntil = new Date(calculatedSinceDate);

            currentUntil.setDate(currentUntil.getDate() + 1);

            if (currentUntil > calculatedUntilDate) {
                currentUntil.setTime(calculatedUntilDate.getTime());
            }

            const workEvents = await database.prisma.workEvent.findMany({
                where: {
                    AND: [
                        { workerId: workerId },
                        { isDeleted: false },
                        {
                            timeStart: {
                                lte: currentUntil,
                            },
                        },
                        {
                            timeEnd: {
                                gte: currentSince,
                            },
                        },
                    ],
                },
            });

            data.push({
                sinceDate: currentSince.toISOString(),
                untilDate: currentUntil.toISOString(),
                workEvents: workEvents.map((event) => ({
                    sinceDate: event.timeStart.toISOString(),
                    untilDate: event.timeEnd.toISOString(),
                    displayDate: new Date(
                        event.timeStart.getTime() / 2 +
                            event.timeEnd.getTime() / 2 +
                            ENV.DISPLAY_DATE_OFFSET * 60 * 1000
                    ).toISOString(),
                    type: event.type,
                    id: event.id,
                    placeStart: event.placeStart ?? undefined,
                    placeEnd: event.placeEnd ?? undefined,
                })),
                time: calculateWorkTimeInMinutes(currentSince, currentUntil, workEvents),
                displayDate: '',
            });

            calculatedSinceDate.setTime(currentUntil.getTime());
        }

        return data.reverse();
    };

    const updateWorkEvent: (
        workEventId: string,
        userId: string | undefined,
        data: ApiUpdateWorkEvent
    ) => Promise<void> = async (workEventId, userId, data) => {
        const workEvent = await database.prisma.workEvent.findUnique({
            where: { id: workEventId },
        });

        if (!workEvent) {
            throw new Error(`Work event with ID ${workEventId} not found`);
        }
        await database.prisma.workEvent.update({
            where: { id: workEventId },
            data: {
                isDeleted: data.isDeleted,
                lastModifiedByUserId: userId,
                lastModified: new Date(),
            },
        });
    };

    return { createWorkEvent, getWorkEvents, getWorkEventsGrouped, updateWorkEvent };
};

export { workEventController };
