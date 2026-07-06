import { Container, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@src/components/pagination';
import { useState } from 'react';
import { AdminWorkerTable, AdminWorkerTableRow } from '@src/components/admin-worker-table';
import { getApiWorkers } from '@src/api/api-worker';

const AdminWorkerPage = () => {
    const pageSize = 15;
    const [pageNumber, setPageNumber] = useState(1);
    const [groupId, setGroupId] = useState<string | undefined>(undefined);
    const [keyword, setKeyword] = useState<string | undefined>(undefined);
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin', 'worker', pageNumber, pageSize],
        queryFn: async () => {
            return getApiWorkers(pageNumber, pageSize, keyword, groupId, true);
        },
        retry: false,
        staleTime: 0,
        gcTime: 0,
    });

    return (
        <Container pb={20}>
            <Heading size="4xl" mb={6}>
                Workers
            </Heading>
            <AdminWorkerTable
                loading={isLoading}
                error={error?.message}
                empty={data?.data?.length === 0}
            >
                {data?.data?.map((worker) => (
                    <AdminWorkerTableRow key={worker.id} data={worker} />
                ))}
            </AdminWorkerTable>
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

export default AdminWorkerPage;
