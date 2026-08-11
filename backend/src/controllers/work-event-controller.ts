import { ApiGetWorkEventGrouped } from '@shared/types/api/api-work-event';
import { ENV } from '../config/enviroment';
import { randomInt } from 'node:crypto';

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
            const currentUntil = new Date(calculatedSinceDate);
            currentUntil.setDate(currentUntil.getDate() + 1);

            if (currentUntil > calculatedUntilDate) {
                currentUntil.setTime(calculatedUntilDate.getTime());
            }

            data.push({
                sinceDate: calculatedSinceDate.toISOString(),
                untilDate: currentUntil.toISOString(),
                workEvents: [],
                time: 121,
            });
            calculatedSinceDate.setDate(currentUntil.getDate());
        }

        return data.reverse();
    };

    return { getWorkEventsGrouped };
};

export { WorkEventController };
