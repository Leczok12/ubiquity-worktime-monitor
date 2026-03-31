export interface ApiWorkEvent {
    id: string;
    timeStart: string;
    placeStart?: string;
    timeEnd: string;
    placeEnd?: string;
    type: 'WORK' | 'BREAK';
}

export interface ApiWorkDay {
    dayStart: string;
    dayEnd: string;
    events: ApiWorkEvent[];
}

export interface ApiWorkEventsResponse {
    days: ApiWorkDay[];
}
