export interface ApiWorkEvent {
    id: string;
    timeStart: Date;
    placeStart: string;
    timeEnd: Date;
    placeEnd: string;
    type: 'WORK' | 'BREAK';
}

export interface ApiWorkDay {
    dayStart: Date;
    dayEnd: Date;
    events: ApiWorkEvent[];
}

export interface ApiWorkEventsResponse {
    days: ApiWorkDay[];
}
