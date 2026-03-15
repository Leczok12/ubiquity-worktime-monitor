import { apiWorker } from '@src/api/api-worker';
import { useQuery } from '@tanstack/react-query';

export const useWorker = ({
    pageSize,
    pageNumber,
    keyword,
    groupId,
}: {
    pageSize?: number;
    pageNumber?: number;
    keyword?: string;
    groupId?: string;
}) => {
    return useQuery({
        queryKey: ['worker', { pageSize, pageNumber, keyword, groupId }],
        queryFn: () => apiWorker({ pageSize, pageNumber, keyword, groupId }),
        staleTime: 1000 * 60 * 5,
    });
};
