import { Container } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@src/components/pagination';
import { useState } from 'react';
import { getApiWorkers } from '@src/api/api-worker';
import WorkerSearchBar from '@src/components/worker-search-bar';
import { WorkerTable, WorkerTableRow } from '@src/components/worker-table';
import { useNavigate } from 'react-router';

const HomePage = () => {
    const pageSize = 15;
    const navigator = useNavigate();
    const [pageNumber, setPageNumber] = useState(1);
    const [groupId, setGroupId] = useState<string | undefined>(undefined);
    const [keyword, setKeyword] = useState<string | undefined>(undefined);
    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ['worker', pageNumber, pageSize, keyword, groupId],
        queryFn: async () => {
            return getApiWorkers(pageNumber, pageSize, keyword, groupId);
        },
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    return (
        <Container pb={20}>
            <WorkerSearchBar
                onSearch={(keyword, groupId) => {
                    setKeyword(keyword);
                    setGroupId(groupId);
                    setPageNumber(1);
                    refetch();
                }}
            />
            <WorkerTable
                loading={isLoading || isFetching}
                error={error?.message}
                empty={data?.data?.length === 0}
            >
                {data?.data?.map((worker) => (
                    <WorkerTableRow
                        key={worker.id}
                        data={worker}
                        onClick={() => navigator(`/worker/${worker.id}`)}
                    />
                ))}
            </WorkerTable>
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

export default HomePage;
