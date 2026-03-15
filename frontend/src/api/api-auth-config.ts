import type { ApiAuthConfigResponse } from '@shared/api-auth';
import { type ApiResponse } from '@shared/api-response';

export const apiAuthConfig = async (): Promise<ApiAuthConfigResponse> => {
    const response = await fetch('/api/auth/config', {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiAuthConfigResponse>;
    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? 'Failed to fetch auth config');
    }
    return payload.data;
};
