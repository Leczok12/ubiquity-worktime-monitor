import type { ApiResponse } from '@shared/types/api/api-response';
import type { ApiGetUser, ApiUpdateUser } from '@shared/types/api/api-user';

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

export const updateApiUser = async (
    id: string,
    data: ApiUpdateUser
): Promise<ApiResponse<undefined>> => {
    const response = await fetch(`/api/user/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const payload = (await response.json()) as ApiResponse<undefined>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to update user');
    }

    return payload;
};
