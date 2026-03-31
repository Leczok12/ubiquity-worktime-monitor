import { apiWorkEvents } from '@src/api/api-work-events';
import { useQuery } from '@tanstack/react-query';

export const useWorkEvents = (workerId: string, since: Date, until: Date) => {
    return useQuery({
        queryKey: ['work-events', workerId, since.getTime(), until.getTime()],
        queryFn: () => apiWorkEvents(workerId, since, until),
        staleTime: 0,
        refetchInterval: 1000 * 60 * 5,
        retry: false,
    });
};
