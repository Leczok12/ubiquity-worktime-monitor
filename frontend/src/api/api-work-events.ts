import type { ApiGetWorkEventGrouped } from '@shared/types/api/api-work-event';
import type { ApiResponse } from '@shared/types/api/api-response';

export const getApiWorkEvents = async (
    workerId: string,
    startDate: string,
    endDate: string
): Promise<ApiResponse<ApiGetWorkEventGrouped[]>> => {
    const searchParams = new URLSearchParams();

    searchParams.set('startDate', startDate);
    searchParams.set('endDate', endDate);

    const response = await fetch(`/api/work-event/${workerId}?` + searchParams, {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiGetWorkEventGrouped[]>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch work events');
    }

    return payload;
};
