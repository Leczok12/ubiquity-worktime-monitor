import type { ApiAdminGetDeviceResponse, ApiAdminUpdateDeviceRequest } from '@shared/api-admin-device';
import { type ApiResponse } from '@shared/api-response';

export const apiAdminDevices = async () => {
    const response = await fetch(`/api/admin/device/all`, {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiAdminGetDeviceResponse[]>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch devices');
    }

    return payload.data;
};

export const apiAdminUpdateDevices = async (data: ApiAdminUpdateDeviceRequest) => {
    const response = await fetch(`/api/admin/device/all`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const payload = (await response.json()) as ApiResponse<ApiAdminGetDeviceResponse[]>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch devices');
    }

    return payload.data;
};
