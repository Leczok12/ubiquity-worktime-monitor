import { apiAdminDevices } from '@src/api/api-admin-device';
import { useQuery } from '@tanstack/react-query';

export const useAdminDevice = () => {
    return useQuery({
        queryKey: ['admin-device'],
        queryFn: apiAdminDevices,
        staleTime: 1000 * 60 * 5,
    });
};
