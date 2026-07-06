import type { ApiGetGroup, ApiUpdateGroup } from '@shared/types/api/api-group';
import type { ApiResponse } from '@shared/types/api/api-response';

export const getApiGroups = async (
    pageNumber?: number,
    pageSize?: number,
    skipShow?: boolean
): Promise<ApiResponse<ApiGetGroup[]>> => {
    const searchParams = new URLSearchParams();

    if (skipShow !== undefined) {
        searchParams.set('skipShow', skipShow.toString());
    }

    if (pageNumber !== undefined) {
        searchParams.set('pageNumber', pageNumber.toString());
    }

    if (pageSize !== undefined) {
        searchParams.set('pageSize', pageSize.toString());
    }

    const response = await fetch('/api/group/all?' + searchParams, {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiGetGroup[]>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch devices');
    }

    return payload;
};

export const updateApiGroup = async (
    id: string,
    data: ApiUpdateGroup
): Promise<ApiResponse<undefined>> => {
    const response = await fetch(`/api/group/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const payload = (await response.json()) as ApiResponse<undefined>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to update group');
    }

    return payload;
};
