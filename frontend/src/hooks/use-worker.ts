import { apiWorker } from '@src/api/api-worker';
import { useQuery } from '@tanstack/react-query';

export const useWorker = ({ workerId }: { workerId: string }) => {
    return useQuery({
        queryKey: ['worker', { workerId }],
        queryFn: () => apiWorker({ workerId }),
        staleTime: 1000 * 60 * 5,
    });
};
