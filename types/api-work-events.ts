/* API Work Events Types */
export type ApiWorkEventType = 'WORK' | 'BREAK';

/* API Get Worker Work Events Response */
export interface ApiGetWorkerWorkEventsResponse {
    seconds: number;
    days: ApiWorkDay[];
}
export interface ApiWorkDay {
    seconds: number;
    dayStart: string;
    dayEnd: string;
    events: ApiWorkEvent[];
}
export interface ApiWorkEvent {
    id: string;
    timeStart: string;
    placeStart?: string;
    timeEnd: string;
    placeEnd?: string;
    type: ApiWorkEventType;
}

/* API create Work Event Request */
export interface ApiCreateWorkEventRequest {
    timeStart: string;
    placeStart?: string;
    timeEnd: string;
    placeEnd?: string;
    type: ApiWorkEventType;
}

/* API Update Work Event Request */
export interface ApiUpdateWorkEventRequest {
    timeStart: string;
    placeStart?: string;
    timeEnd: string;
    placeEnd?: string;
    type: ApiWorkEventType;
}
