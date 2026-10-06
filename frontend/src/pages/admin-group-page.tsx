import { Container, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getApiGroups, updateApiGroup } from '@src/api/api-group';
import { AdminGroupTable } from '@src/components/admin-group-table';
import Pagination from '@src/components/pagination';
import { useState } from 'react';
import type { ApiUpdateGroup } from '@shared/types/api/api-group';

const AdminGroupPage = () => {
    const pageSize = 12;
    const [pageNumber, setPageNumber] = useState(1);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | undefined>(undefined);
    const { data, isLoading, error, refetch, isRefetching } = useQuery({
        queryKey: ['admin', 'group', pageNumber, pageSize],
        queryFn: async () => {
            return getApiGroups(pageNumber, pageSize, true);
        },
        staleTime: 100 * 60 * 5,
        gcTime: 100 * 60 * 10,
    });

    const onEdit = async (id: string, data: ApiUpdateGroup) => {
        setDisabled(true);
        try {
            await updateApiGroup(id, data);
            refetch();
        } catch (error) {
            setUpdateError((error as Error).message);
        } finally {
            setDisabled(false);
        }
    };

    return (
        <Container pb={'60px'} display="flex" flexDirection="column" gap={6}>
            <Heading size="4xl" mb={6}>
                Groups
            </Heading>
            <AdminGroupTable
                loading={isLoading}
                error={error?.message || updateError}
                data={data?.data}
                disabled={disabled || isRefetching}
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

export default AdminGroupPage;
