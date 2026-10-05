import type { ApiGetConfig } from '@shared/types/api/api-config';
import type { ApiResponse } from '@shared/types/api/api-response';

export const getApiConfig = async (): Promise<ApiResponse<ApiGetConfig>> => {
    const response = await fetch('/api/config', {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiGetConfig>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch configuration');
    }

    return payload;
};
