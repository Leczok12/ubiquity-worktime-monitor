import { Pagination } from '@src/components/pagination';
import { WorkerSearchBar } from '@src/components/worker-search-bar';
import { WorkerRow } from '@src/components/worker-row';
import { useWorkers } from '@src/hooks/use-workers';
import { useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useGroup } from '@src/hooks/use-group';
import { Loader } from '@src/components/loader';
import styles from './home.module.scss';

const HomePage = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState<string | undefined>(undefined);
    const [groupId, setGroupId] = useState<string | undefined>(undefined);

    const { data: groupData, isLoading: isGroupLoading, error: groupError, isError: isGroupError } = useGroup();
    const {
        data: workersData,
        isLoading: isWorkersLoading,
        error: workersError,
        isError: isWorkersError,
    } = useWorkers({ pageNumber, pageSize: 15, keyword, groupId });

    return (
        <Container className={styles.home}>
            {isGroupLoading ? <Loader /> : null}
            <WorkerSearchBar
                onSearch={(keyword, groupId) => {
                    setKeyword(keyword);
                    setGroupId(groupId);
                    setPageNumber(1);
                }}
                groups={groupData?.map((group) => ({ id: group.id, name: group.name })) ?? []}
                disabled={isWorkersLoading}
            />

            {!isGroupLoading &&
                (workersData !== undefined ? (
                    <>
                        <ListGroup>
                            {workersData.data?.map((worker) => (
                                <WorkerRow key={worker.id} worker={worker} />
                            ))}
                        </ListGroup>
                        <Pagination
                            pageNumber={workersData.pagination?.page ?? 1}
                            totalPages={Math.ceil(
                                (workersData.pagination?.total ?? 1) / (workersData.pagination?.pageSize ?? 1)
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
