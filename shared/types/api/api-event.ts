import { ApiGetDevice } from './api-device';
import { ApiGetWorker } from './api-worker';

export interface ApiGetEvent {
    id: string;
    deviceId: string;
    workerId: string;
    date: string; // ISO 8601 date string
}

export interface ApiGetEventExtended {
    id: string;
    device: ApiGetDevice;
    worker: ApiGetWorker;
    date: string; // ISO 8601 date string
}

export interface ApiCreateEvent {
    id?: string;
    deviceId: string;
    workerId: string;
    date: string; // ISO 8601 date string
}

export interface ApiUpdateEvent {
    deviceId?: string;
    workerId?: string;
    date?: string; // ISO 8601 date string
}
