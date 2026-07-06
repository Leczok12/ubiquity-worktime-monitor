import type { ApiGetStatistics } from '@shared/types/api/api-statistics';
import type { ApiResponse } from '@shared/types/api/api-response';

export const getApiStatistics = async (
    extended?: boolean
): Promise<ApiResponse<ApiGetStatistics>> => {
    const searchParams = new URLSearchParams();

    if (extended !== undefined) {
        searchParams.set('extended', extended.toString());
    }

    const response = await fetch('/api/statistics?' + searchParams, {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiGetStatistics>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch statistics');
    }

    return payload;
};
