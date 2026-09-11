import type { ApiResponse } from '@shared/types/api/api-response';
import type { ApiAuthConfig, ApiAuthUser, ApiAuthUserLoginLocal } from '@shared/types/api/api-auth';

export const getApiAuthConfig = async (): Promise<ApiResponse<ApiAuthConfig>> => {
    const response = await fetch('/api/auth/config', {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiAuthConfig>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(
            payload.errorMessage ?? payload.status ?? 'Failed to fetch authentication configuration'
        );
    }

    return payload;
};

export const getApiAuthUser = async (): Promise<ApiResponse<ApiAuthUser>> => {
    const response = await fetch('/api/auth/user', {
        method: 'GET',
    });
    const payload = (await response.json()) as ApiResponse<ApiAuthUser>;

    if (payload.status !== 'SUCCESS' && payload.status !== 'UNAUTHORIZED') {
        throw new Error(
            payload.errorMessage ?? payload.status ?? 'Failed to fetch authenticated user'
        );
    }

    return payload;
};

export const loginLocalApiAuthUser = async (data: ApiAuthUserLoginLocal): Promise<void> => {
    const response = await fetch('/api/auth/local/callback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const payload = (await response.json()) as ApiResponse<undefined>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(
            payload.errorMessage ?? payload.status ?? 'Failed to login authenticated user'
        );
    }
};

export const logoutApiAuthUser = async (): Promise<void> => {
    const response = await fetch('/api/auth/logout', {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<undefined>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(
            payload.errorMessage ?? payload.status ?? 'Failed to logout authenticated user'
        );
    }
};
