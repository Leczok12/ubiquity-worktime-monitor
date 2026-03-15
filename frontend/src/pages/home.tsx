import { Pagination } from '@src/components/pagination';
import { useWorker } from '@src/hooks/use-worker';
import { useState } from 'react';
import { Card, Container } from 'react-bootstrap';

const HomePage: React.FC = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const { data, isLoading, isError, error } = useWorker({ pageNumber, pageSize: 10 });

    if (isLoading || data === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Card className="mx-auto mt-3 mb-6" style={{ maxWidth: '800px' }}>
                <Card.Header>
                    <h1>Home</h1>
                </Card.Header>
                <Card.Body>
                    {data?.data?.map((worker) => (
                        <div key={worker.id}>
                            <h2>{worker.name}</h2>
                        </div>
                    ))}
                </Card.Body>
            </Card>
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
