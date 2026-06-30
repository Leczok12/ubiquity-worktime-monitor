import type { ApiAdminGetDeviceResponse, ApiAdminUpdateDeviceRequest } from '@shared/api-admin-device';
import { type ApiResponse } from '@shared/api-response';

export const apiAdminDevices = async (pageNumber?: number, pageSize?: number) => {
    const params =
        pageNumber !== undefined && pageSize !== undefined
            ? `?pageNumber=${pageNumber}&pageSize=${pageSize}`
            : pageSize !== undefined
              ? `?pageSize=${pageSize}`
              : '';

    const response = await fetch(`/api/admin/device/all${params}`, {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiAdminGetDeviceResponse[]>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch devices');
    }

    return payload;
};

export const apiAdminUpdateDevice = async (id: string, data: ApiAdminUpdateDeviceRequest) => {
    const response = await fetch(`/api/admin/device/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const payload = (await response.json()) as ApiResponse<ApiAdminGetDeviceResponse[]>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch devices');
    }

    return payload;
};
