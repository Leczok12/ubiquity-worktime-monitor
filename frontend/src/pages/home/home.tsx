import { Pagination } from '@src/components/pagination';
import { WorkerSearchBar } from '@src/components/worker-search-bar';
import { WorkerRow } from '@src/components/worker-row';
import { useWorker } from '@src/hooks/use-worker';
import { useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useGroup } from '@src/hooks/use-group';
import { Loader } from '@src/components/loader';

const HomePage = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState<string | undefined>(undefined);
    const [groupId, setGroupId] = useState<string | undefined>(undefined);

    const { data: groupData, isLoading: isGroupLoading, error: groupError, isError: isGroupError } = useGroup();
    const {
        data: workerData,
        isLoading: isWorkerLoading,
        error: workerError,
        isError: isWorkerError,
    } = useWorker({ pageNumber, pageSize: 15, keyword, groupId });

    return (
        <Container style={{ maxWidth: '800px' }}>
            {isGroupLoading ? <Loader /> : null}
            <WorkerSearchBar
                onSearch={(keyword, groupId) => {
                    setKeyword(keyword);
                    setGroupId(groupId);
                    setPageNumber(1);
                }}
                groups={groupData?.map((group) => ({ id: group.id, name: group.name })) ?? []}
                disabled={isWorkerLoading}
            />

            {!isGroupLoading &&
                (workerData !== undefined ? (
                    <>
                        <ListGroup>
                            {workerData.data?.map((worker) => (
                                <WorkerRow
                                    key={worker.id}
                                    worker={worker}
                                    onClick={() => {
                                        console.log(worker.id);
                                    }}
                                />
                            ))}
                        </ListGroup>
                        <Pagination
                            pageNumber={workerData.pagination?.page ?? 1}
                            totalPages={Math.ceil(
                                (workerData.pagination?.total ?? 1) / (workerData.pagination?.pageSize ?? 1)
                            )}
                            onPageChange={setPageNumber}
                        />
                    </>
                ) : (
                    <Loader compact />
                ))}
        </Container>
    );
};

export default HomePage;
