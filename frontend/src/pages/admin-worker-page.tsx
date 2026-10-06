import { Container, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@src/components/pagination';
import { useState } from 'react';
import { AdminWorkerTable } from '@src/components/admin-worker-table';
import { getApiWorkers, updateApiWorker } from '@src/api/api-worker';
import WorkerSearchBar from '@src/organisms/worker-search-bar';
import type { ApiUpdateWorker } from '@shared/types/api/api-worker';

const AdminWorkerPage = () => {
    const pageSize = 12;
    const [pageNumber, setPageNumber] = useState(1);
    const [groupId, setGroupId] = useState<string | undefined>(undefined);
    const [keyword, setKeyword] = useState<string | undefined>(undefined);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | undefined>(undefined);
    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ['admin', 'worker', pageNumber, pageSize, keyword, groupId],
        queryFn: async () => {
            return getApiWorkers(pageNumber, pageSize, keyword, groupId, true);
        },
        staleTime: 100 * 60 * 5,
        gcTime: 100 * 60 * 10,
    });

    const onEdit = async (id: string, data: ApiUpdateWorker) => {
        setDisabled(true);
        try {
            await updateApiWorker(id, data);
            refetch();
        } catch (error) {
            setUpdateError((error as Error).message);
        } finally {
            setDisabled(false);
        }
    };

    return (
        <Container pb={'60px'} display="flex" flexDirection="column" gap={6}>
            <Heading size="4xl">Workers</Heading>
            <WorkerSearchBar
                onSearch={(keyword, groupId) => {
                    setKeyword(keyword);
                    setGroupId(groupId);
                    setPageNumber(1);
                    refetch();
                }}
            />
            <AdminWorkerTable
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

export default AdminWorkerPage;
