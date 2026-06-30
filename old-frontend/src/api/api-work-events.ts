import { type ApiResponse } from '@shared/api-response';
import type {
    ApiCreateWorkEventRequest,
    ApiGetWorkerWorkEventsResponse,
    ApiUpdateWorkEventRequest,
} from '@shared/api-work-events';

export const apiWorkerWorkEvents = async (
    workerId: string,
    since: Date,
    until: Date
): Promise<ApiGetWorkerWorkEventsResponse> => {
    const response = await fetch(
        `/api/work-events/worker/${workerId}?since=${since.getTime() / 1000}&until=${until.getTime() / 1000}`,
        {
            method: 'GET',
        }
    );

    const payload = (await response.json()) as ApiResponse<ApiGetWorkerWorkEventsResponse>;

    if (payload.status !== 'SUCCESS' || payload.data === undefined) {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch work events');
    }

    return payload.data;
};

export const apiCreateWorkEvent = async (workerId: string, data: ApiCreateWorkEventRequest) => {
    const { timeStart, timeEnd, type, placeEnd, placeStart } = data;
    const response = await fetch(`/api/work-events/worker/${workerId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeStart, timeEnd, type, placeEnd, placeStart }),
    });

    const payload = (await response.json()) as ApiResponse<undefined>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch work events');
    }

    return payload;
};

export const apiUpdateWorkEvent = async (workEventId: string, data: ApiUpdateWorkEventRequest) => {
    const { timeStart, timeEnd, type, placeStart, placeEnd } = data;
    const response = await fetch(`/api/work-events/${workEventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeStart, timeEnd, type, placeStart, placeEnd }),
    });

    const payload = (await response.json()) as ApiResponse<undefined>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch work events');
    }

    return payload;
};

export const apiDeleteWorkEvent = async (workEventId: string) => {
    const response = await fetch(`/api/work-events/${workEventId}`, {
        method: 'DELETE',
    });

    const payload = (await response.json()) as ApiResponse<undefined>;

    if (payload.status !== 'SUCCESS') {
        throw new Error(payload.errorMessage ?? payload.status ?? 'Failed to fetch work events');
    }

    return payload;
};
