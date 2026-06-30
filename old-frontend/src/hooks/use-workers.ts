import { apiWorkerAll, apiWorkerGroup, apiWorkerKeyword } from '@src/api/api-worker';
import { useQuery } from '@tanstack/react-query';

export const useWorkers = ({
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
        queryKey: ['workers', { pageSize, pageNumber, keyword, groupId }],
        queryFn: () => {
            if (keyword !== undefined) {
                return apiWorkerKeyword({ pageSize, pageNumber, keyword });
            } else if (groupId !== undefined) {
                return apiWorkerGroup({ pageSize, pageNumber, groupId });
            }
            return apiWorkerAll({ pageSize, pageNumber });
        },
        staleTime: 1000 * 60 * 5,
    });
};
