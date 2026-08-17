import type {
    ApiCreateWorkEvent,
    ApiGetWorkEvent,
    ApiGetWorkEventGrouped,
    ApiUpdateWorkEvent,
} from '@shared/types/api/api-work-event';
import type { ApiResponse } from '@shared/types/api/api-response';

export const createApiWorkEvent = async (
    workerId: string,
    data: ApiCreateWorkEvent,
    userId?: string
): Promise<ApiResponse<undefined>> => {
    const response = await fetch(`/api/work-event/worker/${workerId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, userId }),
    });

    const payload = (await response.json()) as ApiResponse<undefined>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to create work event');
    }

    return payload;
};

export const getApiWorkEventsGrouped = async (
    workerId: string,
    startDate: string,
    endDate: string
): Promise<ApiResponse<ApiGetWorkEventGrouped[]>> => {
    const searchParams = new URLSearchParams();

    searchParams.set('startDate', startDate);
    searchParams.set('endDate', endDate);

    const response = await fetch(`/api/work-event/worker/${workerId}/grouped?` + searchParams, {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiGetWorkEventGrouped[]>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch work events');
    }

    return payload;
};

export const getApiWorkEvents = async (
    workerId: string,
    startDate: string,
    endDate: string
): Promise<ApiResponse<ApiGetWorkEvent[]>> => {
    const searchParams = new URLSearchParams();

    searchParams.set('startDate', startDate);
    searchParams.set('endDate', endDate);

    const response = await fetch(`/api/work-event/worker/${workerId}?` + searchParams, {
        method: 'GET',
    });

    const payload = (await response.json()) as ApiResponse<ApiGetWorkEvent[]>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch work event');
    }

    return payload;
};

export const updateApiWorkEvent = async (
    workEventId: string,
    data: ApiUpdateWorkEvent
): Promise<ApiResponse<undefined>> => {
    const response = await fetch(`/api/work-event/${workEventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const payload = (await response.json()) as ApiResponse<undefined>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to update work event');
    }

    return payload;
};
