import { type ApiResponse } from '@shared/api-response';

export const apiAuthLocalLogin = async ({
    username,
    password,
}: {
    username: string;
    password: string;
}): Promise<void> => {
    const response = await fetch('/api/auth/callback/local', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    });

    const payload = (await response.json()) as ApiResponse<undefined>;
    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to login');
    }
};
