import type { ApiAuthConfigResponse } from '@shared/api-auth';
import { apiAuthConfig } from '@src/api/api-auth-config';
import { useQuery } from '@tanstack/react-query';

export const useAuthConfig = () => {
    return useQuery<ApiAuthConfigResponse, Error>({
        queryKey: ['auth-config'],
        queryFn: apiAuthConfig,
        staleTime: 1000 * 60 * 5,
    });
};
