import { Pagination } from '@src/components/pagination';
import { WorkerRow } from '@src/components/worker-row';
import { useWorker } from '@src/hooks/use-worker';
import { useState } from 'react';
import { Card, Container, ListGroup } from 'react-bootstrap';

const HomePage: React.FC = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const { data, isLoading } = useWorker({ pageNumber, pageSize: 10 });

    if (isLoading || data === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <ListGroup>
                {data.data?.map((worker) => (
                    <WorkerRow key={worker.id} worker={worker} />
                ))}
            </ListGroup>
            <br />
            <br />
            <br />
            <br />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'fixed',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <Pagination
                    pageNumber={data?.pagination?.page ?? 1}
                    totalPages={Math.ceil((data.pagination?.total ?? 1) / (data.pagination?.pageSize ?? 1))}
                    onPageChange={setPageNumber}
                />
            </div>
        </Container>
    );
};

export default HomePage;
