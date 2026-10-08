import { Container, Heading } from '@chakra-ui/react';
import { getApiUsers } from '@src/api/api-user';
import { AdminUserTable } from '@src/components/admin-user-table';
import Alert from '@src/components/alert';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Pagination from '@src/components/pagination';
import type { ApiUpdateUser } from '@shared/types/api/api-user';

const AdminUsersPage = () => {
    const pageSize = 12;
    const [pageNumber, setPageNumber] = useState(1);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | undefined>(undefined);
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['admin', 'user', pageNumber, pageSize],
        queryFn: async () => {
            return getApiUsers(pageNumber, pageSize);
        },
        staleTime: 100 * 60 * 5,
        gcTime: 100 * 60 * 10,
    });

    const onEdit = async (id: string, data: ApiUpdateUser) => {
        setDisabled(true);
        try {
            // await updateApiGroup(id, data);
            refetch();
        } catch (error) {
            setUpdateError((error as Error).message);
        } finally {
            setDisabled(false);
        }
    };

    return (
        <Container pb={'60px'} display="flex" flexDirection="column" gap={6}>
            <Heading size="4xl">Users</Heading>
            <AdminUserTable
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

export default AdminUsersPage;
