export interface ApiWorkEvent {
    id: string;
    timeStart: Date;
    placeStart: string;
    timeEnd: Date;
    placeEnd: string;
    type: 'WORK' | 'BREAK';
}

export interface ApiWorkDay {
    seconds: number;
    dayStart: Date;
    dayEnd: Date;
    events: ApiWorkEvent[];
}

export interface ApiWorkEventsResponse {
    seconds: number;
    days: ApiWorkDay[];
}
