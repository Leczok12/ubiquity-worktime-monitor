import { Pagination } from '@src/components/pagination';
import { SearchBar } from '@src/components/search-bar';
import { WorkerRow } from '@src/components/worker-row';
import { useWorker } from '@src/hooks/use-worker';
import { useState } from 'react';
import { Card, Container, ListGroup } from 'react-bootstrap';

const HomePage: React.FC = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState<string | undefined>(undefined);
    const { data, isLoading } = useWorker({ pageNumber, pageSize: 10, keyword });

    // if (isLoading || data === undefined) {
    //     return <div>Loading...</div>;
    // }

    return (
        <Container style={{ maxWidth: '800px' }}>
            <SearchBar
                onSearch={(e) => {
                    setKeyword(e === '' ? undefined : e);
                    setPageNumber(1);
                }}
                disabled={isLoading}
            />
            {data !== undefined && (
                <>
                    <ListGroup>
                        {data.data?.map((worker) => (
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
                        pageNumber={data?.pagination?.page ?? 1}
                        totalPages={Math.ceil((data.pagination?.total ?? 1) / (data.pagination?.pageSize ?? 1))}
                        onPageChange={setPageNumber}
                    />
                </>
            )}
        </Container>
    );
};

export default HomePage;
