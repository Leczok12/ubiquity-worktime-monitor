import type { ApiCreateWorkEvent, ApiGetWorkEventGrouped } from '@shared/types/api/api-work-event';
import { createContext } from 'react';

export const WorkEventsContext = createContext<{
    isProcessing: boolean;
    isLodaing: boolean;
    eventsGrouped: ApiGetWorkEventGrouped[] | undefined;
    dateRange: [Date, Date];
    changeDateRange: (dateRange: [Date, Date]) => void;
    removeEvent: (id: string) => Promise<void>;
    createEvent: (data: ApiCreateWorkEvent) => Promise<void>;
}>({
    isProcessing: false,
    isLodaing: false,
    eventsGrouped: undefined,
    dateRange: [new Date(), new Date()],
    changeDateRange: () => {},
    removeEvent: async () => {},
    createEvent: async () => {},
});
