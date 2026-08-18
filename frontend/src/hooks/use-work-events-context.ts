import type { ApiCreateWorkEvent, ApiGetWorkEventGrouped } from '@shared/types/api/api-work-event';
import { createContext } from 'react';

export const WorkEventsContext = createContext<{
    eventsGrouped: ApiGetWorkEventGrouped | undefined;
    changeDateRange: (dateRange: [Date, Date]) => void;
    removeEvent: (id: string) => void;
    createEvent: (data: ApiCreateWorkEvent) => void;
}>({
    eventsGrouped: undefined,
    changeDateRange: () => {},
    removeEvent: () => {},
    createEvent: () => {},
});
