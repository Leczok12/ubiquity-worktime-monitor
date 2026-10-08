import { Container, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@src/components/pagination';
import { useState } from 'react';
import { AdminDeviceTable } from '@src/components/admin-device-table';
import { getApiDevices, updateApiDevice } from '@src/api/api-device';
import type { ApiUpdateDevice } from '@shared/types/api/api-device';

const AdminDevicePage = () => {
    const pageSize = 12;
    const [pageNumber, setPageNumber] = useState(1);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | undefined>(undefined);
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['admin', 'device', pageNumber, pageSize],
        queryFn: async () => {
            return getApiDevices(pageNumber, pageSize);
        },
        staleTime: 100 * 60 * 5,
        gcTime: 100 * 60 * 10,
    });

    const onEdit = async (id: string, data: ApiUpdateDevice) => {
        setDisabled(true);
        try {
            await updateApiDevice(id, data);
            refetch();
        } catch (error) {
            setUpdateError((error as Error).message);
        } finally {
            setDisabled(false);
        }
    };

    return (
        <Container pb={'60px'} display="flex" flexDirection="column" gap={6}>
            <Heading size="4xl">Devices</Heading>
            <AdminDeviceTable
                loading={isLoading}
                error={error?.message || updateError}
                data={data?.data}
                disabled={disabled || isFetching}
                onEdit={onEdit}
            />
            <Pagination
                show={data !== undefined}
                pageNumber={pageNumber}
                count={data?.pagination?.total || 1}
                pageSize={data?.pagination?.pageSize || 10}
                onPageChange={(details) => {
                    setPageNumber(details.page);
                }}
            />
        </Container>
    );
};

export default AdminDevicePage;
