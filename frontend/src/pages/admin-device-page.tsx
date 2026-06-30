import { Container, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@src/components/pagination';
import { useState } from 'react';
import { AdminDeviceTable, AdminDeviceTableRow } from '@src/components/admin-device-table';
import { getApiDevices } from '@src/api/api-device';

const AdminDevicePage = () => {
    const pageSize = 15;
    const [pageNumber, setPageNumber] = useState(1);
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin', 'device', pageNumber, pageSize],
        queryFn: async () => {
            return getApiDevices(pageNumber, pageSize);
        },
        retry: false,
        staleTime: 0,
        gcTime: 0,
    });

    return (
        <Container pb={20}>
            <Heading size="4xl" mb={6}>
                Devices
            </Heading>
            <AdminDeviceTable
                loading={isLoading}
                error={error?.message}
                empty={data?.data?.length === 0}
            >
                {data?.data?.map((device) => (
                    <AdminDeviceTableRow key={device.id} data={device} />
                ))}
            </AdminDeviceTable>
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
