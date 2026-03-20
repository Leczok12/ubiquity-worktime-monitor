import { type ApiResponse } from '@shared/api-response';
import type { ApiWorkerResponse } from '@shared/api-worker';

export const apiWorkerAll = async ({
    pageSize,
    pageNumber,
}: {
    pageSize?: number;
    pageNumber?: number;
}): Promise<ApiResponse<ApiWorkerResponse[]>> => {
    const response = await (async () => {
        const params =
            pageNumber !== undefined && pageSize !== undefined
                ? `?pageNumber=${pageNumber}&pageSize=${pageSize}`
                : pageSize !== undefined
                  ? `?pageSize=${pageSize}`
                  : '';

        return await fetch('/api/worker/all' + params, {
            method: 'GET',
        });
    })();

    const payload = (await response.json()) as ApiResponse<ApiWorkerResponse[]>;
    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch worker data');
    }

    return payload;
};

export const apiWorkerGroup = async ({
    pageSize,
    pageNumber,
    groupId,
}: {
    pageSize?: number;
    pageNumber?: number;
    groupId: string;
}): Promise<ApiResponse<ApiWorkerResponse[]>> => {
    const response = await (async () => {
        const params =
            pageNumber !== undefined && pageSize !== undefined
                ? `?pageNumber=${pageNumber}&pageSize=${pageSize}`
                : pageSize !== undefined
                  ? `?pageSize=${pageSize}`
                  : '';

        return await fetch(`/api/group/${groupId}/worker/all` + params, {
            method: 'GET',
        });
    })();

    const payload = (await response.json()) as ApiResponse<ApiWorkerResponse[]>;
    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch worker data');
    }

    return payload;
};

export const apiWorkerKeyword = async ({
    pageSize,
    pageNumber,
    keyword,
}: {
    pageSize?: number;
    pageNumber?: number;
    keyword: string;
}): Promise<ApiResponse<ApiWorkerResponse[]>> => {
    const response = await (async () => {
        const params =
            pageNumber !== undefined && pageSize !== undefined
                ? `&pageNumber=${pageNumber}&pageSize=${pageSize}`
                : pageSize !== undefined
                  ? `&pageSize=${pageSize}`
                  : '';

        return await fetch(`/api/worker/find?keyword=${encodeURIComponent(keyword)}` + params, {
            method: 'GET',
        });
    })();

    const payload = (await response.json()) as ApiResponse<ApiWorkerResponse[]>;
    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch worker data');
    }

    return payload;
};

export const apiWorker = async ({ workerId }: { workerId: string }): Promise<ApiResponse<ApiWorkerResponse>> => {
    const response = await fetch(`/api/worker/${workerId}`, {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiWorkerResponse>;
    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch worker data');
    }

    return payload;
};
