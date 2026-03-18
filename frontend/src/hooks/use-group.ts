import { apiGroup } from '@src/api/api-group';
import { useQuery } from '@tanstack/react-query';

export const useGroup = () => {
    return useQuery({
        queryKey: ['group'],
        queryFn: apiGroup,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};
