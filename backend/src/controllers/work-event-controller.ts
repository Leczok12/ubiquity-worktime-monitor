import { ApiGetWorkEventGrouped } from '@shared/types/api/api-work-event';
import { ENV } from '../config/enviroment';
import { randomInt } from 'node:crypto';
import { database } from '@src/config/database';
import { calculateWorkTimeInMinutes } from '@src/utils/calculate-work-time-in-minutes';

const WorkEventController = () => {
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
                sinceDate: calculatedSinceDate.toISOString(),
                untilDate: currentUntil.toISOString(),
                workEvents: workEvents.map((event) => ({
                    sinceDate: event.timeStart.toISOString(),
                    untilDate: event.timeEnd.toISOString(),
                    type: event.type,
                })),
                time: calculateWorkTimeInMinutes(currentSince, currentUntil, workEvents),
            });
            console.log(JSON.stringify(data[data.length - 1], null, 2));
            calculatedSinceDate.setDate(currentUntil.getDate());
        }

        return data.reverse();
    };

    return { getWorkEventsGrouped };
};

export { WorkEventController };
