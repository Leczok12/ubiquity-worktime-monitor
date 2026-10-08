import type { ApiResponse } from '@shared/types/api/api-response';
import type { ApiGetUser } from '@shared/types/api/api-user';

export const getApiUsers = async (
    pageNumber?: number,
    pageSize?: number
): Promise<ApiResponse<ApiGetUser[]>> => {
    const searchParams = new URLSearchParams();

    if (pageNumber !== undefined) {
        searchParams.set('pageNumber', pageNumber.toString());
    }

    if (pageSize !== undefined) {
        searchParams.set('pageSize', pageSize.toString());
    }

    const response = await fetch('/api/user/all?' + searchParams, {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiGetUser[]>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch devices');
    }

    return payload;
};
