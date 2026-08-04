export const workEventTypes = ['WORK', 'BREAK'] as const;

export type ApiGetWorkEvent = {
    type: (typeof workEventTypes)[number];
    startDate: string;
    endDate: string;
};

export type ApiGetWorkEventGrouped = {
    workEvents: ApiGetWorkEvent[];
    startDate: string;
    endDate: string;
};
