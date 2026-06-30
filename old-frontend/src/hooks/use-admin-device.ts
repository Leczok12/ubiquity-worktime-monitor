import { apiAdminDevices } from '@src/api/api-admin-device';
import { useQuery } from '@tanstack/react-query';

export const useAdminDevice = (pageNumber?: number, pageSize?: number) => {
    return useQuery({
        queryKey: ['adminDevices', pageNumber, pageSize],
        queryFn: () => apiAdminDevices(pageNumber, pageSize),
        staleTime: 1000 * 60 * 5,
    });
};
