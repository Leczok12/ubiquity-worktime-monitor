import { type ApiResponse } from '@shared/api-response';
import { type ApiAuthUserResponse } from '@shared/api-auth';

export const apiAuthUser = async (): Promise<ApiAuthUserResponse> => {
    const response = await fetch('/api/auth/user', {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiAuthUserResponse>;
    if (payload.status === 'UNAUTHORIZED') {
        throw new Error('UNAUTHORIZED');
    }

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch user information');
    }

    return payload.data;
};
