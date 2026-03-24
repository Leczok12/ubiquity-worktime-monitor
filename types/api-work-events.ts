export interface ApiWorkEvent {
    events: {
        id: string;
        timeStart: Date;
        placeStart: string;
        timeEnd: Date;
        placeEnd: string;
        type: 'WORK' | 'BREAK';
    }[];
}

export interface ApiWorkEventResponse {
    events: ApiWorkEvent[];
}
