import type { ApiCreateWorkEvent, ApiGetWorkEventGrouped } from '@shared/types/api/api-work-event';
import { createContext } from 'react';

export const WorkEventsContext = createContext<{
    isProcessing: boolean;
    eventsGrouped: ApiGetWorkEventGrouped[] | undefined;
    editorEvents: ApiGetWorkEventGrouped | undefined;
    dateRange: [Date, Date];
    changeDateRange: (dateRange: [Date, Date]) => void;
    removeEvent: (id: string) => void;
    createEvent: (data: ApiCreateWorkEvent) => void;
}>({
    isProcessing: false,
    eventsGrouped: undefined,
    editorEvents: undefined,
    dateRange: [new Date(), new Date()],
    changeDateRange: () => {},
    removeEvent: async () => {},
    createEvent: async () => {},
});
