import type { ApiResponse } from '@shared/types/api/api-response';
import type { ApiGetWorker, ApiUpdateWorker } from '@shared/types/api/api-worker';

export const getApiWorker = async (id: string): Promise<ApiResponse<ApiGetWorker>> => {
    const response = await fetch(`/api/worker/${id}`, {
        method: 'GET',
    });
    const payload = (await response.json()) as ApiResponse<ApiGetWorker>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch worker');
    }
    return payload;
};

export const getApiWorkers = async (
    pageNumber?: number,
    pageSize?: number,
    keyword?: string,
    groupId?: string,
    skipShow?: boolean
): Promise<ApiResponse<ApiGetWorker[]>> => {
    const searchParams = new URLSearchParams();

    if (skipShow !== undefined) {
        searchParams.set('skipShow', skipShow.toString());
    }

    if (pageNumber !== undefined) {
        searchParams.set('pageNumber', pageNumber.toString());
    }

    if (pageSize !== undefined) {
        searchParams.set('pageSize', pageSize.toString());
    }

    const path = (() => {
        if (keyword !== undefined && keyword.trim() !== '') {
            searchParams.set('keyword', keyword.trim());
            return '/api/worker/find?';
        }

        if (groupId !== undefined && groupId.trim() !== '') {
            searchParams.set('groupId', groupId.trim());
            return '/api/group/' + groupId.trim() + '/worker/all?';
        }

        return '/api/worker/all?';
    })();

    const response = await fetch(path + searchParams, {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiGetWorker[]>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch devices');
    }

    return payload;
};

export const updateApiWorker = async (
    id: string,
    data: ApiUpdateWorker
): Promise<ApiResponse<undefined>> => {
    const response = await fetch(`/api/worker/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const payload = (await response.json()) as ApiResponse<undefined>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to update worker');
    }

    return payload;
};
