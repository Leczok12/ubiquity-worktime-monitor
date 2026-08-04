import { ApiGetWorkEventGrouped } from '@shared/types/api/api-work-event';

const WorkEventController = () => {
    const getWorkEventsGrouped: (
        workerId: string,
        startDate: Date,
        endDate: Date
    ) => Promise<ApiGetWorkEventGrouped[]> = async (
        workerId: string,
        startDate: Date,
        endDate: Date
    ) => {
        return [
            {
                workEvents: [],
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            },
        ];
    };

    return { getWorkEventsGrouped };
};

export { WorkEventController };
