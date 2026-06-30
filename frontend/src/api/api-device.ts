import type { ApiGetDevice, ApiUpdateDevice } from '@shared/types/api/api-device';
import type { ApiResponse } from '@shared/types/api/api-response';

export const getApiDevices = async (
    pageNumber?: number,
    pageSize?: number
): Promise<ApiResponse<ApiGetDevice[]>> => {
    const searchParams = new URLSearchParams();

    if (pageNumber !== undefined) {
        searchParams.set('pageNumber', pageNumber.toString());
    }

    if (pageSize !== undefined) {
        searchParams.set('pageSize', pageSize.toString());
    }

    const response = await fetch('/api/device/all?' + searchParams, {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiGetDevice[]>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch devices');
    }

    return payload;
};

export const updateApiDevice = async (
    id: string,
    data: ApiUpdateDevice
): Promise<ApiResponse<undefined>> => {
    const response = await fetch(`/api/device/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const payload = (await response.json()) as ApiResponse<undefined>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to update device');
    }

    return payload;
};
