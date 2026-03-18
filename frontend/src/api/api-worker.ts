import { type ApiResponse } from '@shared/api-response';
import type { ApiWorkerResponse } from '@shared/api-worker';

export const apiWorker = async ({
    pageSize,
    pageNumber,
    keyword,
    groupId,
}: {
    pageSize?: number;
    pageNumber?: number;
    keyword?: string;
    groupId?: string;
}): Promise<ApiResponse<ApiWorkerResponse[]>> => {
    const response = await (async () => {
        const params =
            pageNumber !== undefined && pageSize !== undefined
                ? `pageNumber=${pageNumber}&pageSize=${pageSize}`
                : pageSize !== undefined
                  ? `pageSize=${pageSize}`
                  : '';

        const url =
            keyword !== undefined
                ? `/api/worker/find?keyword=${encodeURIComponent(keyword)}`
                : groupId !== undefined
                  ? `/api/group/${groupId}/worker/all`
                  : `/api/worker/all`;

        const finalUrl = params.length > 0 ? (keyword !== undefined ? `${url}&${params}` : `${url}?${params}`) : url;

        return await fetch(finalUrl, {
            method: 'GET',
        });
    })();

    const payload = (await response.json()) as ApiResponse<ApiWorkerResponse[]>;
    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? 'Failed to fetch worker data');
    }

    return payload;
};
