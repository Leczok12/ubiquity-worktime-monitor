import { type ApiResponse } from '@shared/api-response';
import type { ApiWorkEventsResponse } from '@shared/api-work-events';

export const apiWorkEvents = async (userId: string, since: Date, until: Date): Promise<ApiWorkEventsResponse> => {
    const response = await fetch(
        `/api/work-events/worker/${userId}?since=${since.getTime() / 1000}&until=${until.getTime() / 1000}`,
        {
            method: 'GET',
        }
    );

    const payload = (await response.json()) as ApiResponse<ApiWorkEventsResponse>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch work events');
    }

    return payload.data;
};
