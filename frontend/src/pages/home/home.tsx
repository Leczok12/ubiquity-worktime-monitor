import { Pagination } from '@src/components/pagination';
import { WorkerSearchBar } from '@src/components/worker-search-bar';
import { WorkerRow } from '@src/components/worker-row';
import { useWorkers } from '@src/hooks/use-workers';
import { useState } from 'react';
import { Alert, Container, ListGroup } from 'react-bootstrap';
import { Loader } from '@src/components/loader';
import styles from './home.module.scss';

const HomePage = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState<string | undefined>(undefined);
    const [groupId, setGroupId] = useState<string | undefined>(undefined);

    const { data, isLoading, error, isError } = useWorkers({ pageNumber, pageSize: 15, keyword, groupId });

    return (
        <Container className={styles.home}>
            <WorkerSearchBar
                onSearch={(keyword, groupId) => {
                    setKeyword(keyword);
                    setGroupId(groupId);
                    setPageNumber(1);
                }}
                disabled={isLoading}
            />

            {(() => {
                if (isError) {
                    return <Alert variant="danger">{error?.message}</Alert>;
                }
                if (isLoading || data === undefined || data.data === undefined) {
                    return <Loader compact />;
                }
                if (data.data.length === 0) {
                    return <Alert variant="primary">No workers found</Alert>;
                }
                return (
                    <ListGroup>
                        {data.data.map((worker) => (
                            <WorkerRow key={worker.id} worker={worker} />
                        ))}
                    </ListGroup>
                );
            })()}
            <Pagination
                pageNumber={data?.pagination?.page ?? 1}
                totalPages={Math.ceil((data?.pagination?.total ?? 1) / (data?.pagination?.pageSize ?? 1))}
                onPageChange={setPageNumber}
            />
        </Container>
    );
};

export default HomePage;
