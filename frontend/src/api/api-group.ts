import { type ApiResponse } from '@shared/api-response';
import type { ApiGroupResponse } from '@shared/api-group';

export const apiGroup = async (): Promise<ApiGroupResponse[]> => {
    const response = await fetch('/api/group/all', {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiGroupResponse[]>;
    if (payload.status === 'UNAUTHORIZED') {
        throw new Error('UNAUTHORIZED');
    }

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch group information');
    }

    return payload.data;
};
