import { type ApiResponse } from '@shared/api-response';

export const apiAuthLogout = async (): Promise<void> => {
    const response = await fetch('/api/auth/callback/logout', {
        method: 'POST',
    });

    const payload = (await response.json()) as ApiResponse<undefined>;
    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to logout');
    }
};
