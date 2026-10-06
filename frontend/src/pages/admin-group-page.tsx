import { Container, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getApiGroups } from '@src/api/api-group';
import { AdminGroupTable } from '@src/components/admin-group-table';
import Pagination from '@src/components/pagination';
import { useState } from 'react';

const AdminGroupPage = () => {
    const pageSize = 10;
    const [pageNumber, setPageNumber] = useState(1);
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin', 'group', pageNumber, pageSize],
        queryFn: async () => {
            return getApiGroups(pageNumber, pageSize, true);
        },
        retry: false,
        staleTime: 0,
        gcTime: 0,
    });

    return (
        <Container pb={20}>
            <Heading size="4xl" mb={6}>
                Groups
            </Heading>
            <AdminGroupTable loading={isLoading} error={error?.message} data={data?.data} />
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

export default AdminGroupPage;
