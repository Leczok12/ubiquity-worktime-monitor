import { apiAuthUser } from '@src/api/api-auth-user';
import { useQuery } from '@tanstack/react-query';

export const useAuthUser = () => {
    return useQuery({
        queryKey: ['auth', 'user'],
        queryFn: apiAuthUser,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};
