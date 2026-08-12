export const workEventTypes = ['WORK', 'BREAK'] as const;

export type ApiGetWorkEvent = {
    type: (typeof workEventTypes)[number];
    sinceDate: string;
    untilDate: string;
};

export type ApiCreateWorkEvent = {
    id?: string;
    type: (typeof workEventTypes)[number];
    sinceDate: string;
    untilDate: string;
    placeStart?: string;
    placeEnd?: string;
};

export type ApiGetWorkEventGrouped = {
    workEvents: ApiGetWorkEvent[];
    time: number;
    sinceDate: string;
    untilDate: string;
};
