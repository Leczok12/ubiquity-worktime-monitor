import { Pagination } from '@src/components/pagination';
import { WorkerSearchBar } from '@src/components/worker-search-bar';
import { WorkerRow } from '@src/components/worker-row';
import { useWorkers } from '@src/hooks/use-workers';
import { Alert, Container, ListGroup } from 'react-bootstrap';
import { Loader } from '@src/components/loader';
import styles from './home.module.scss';
import { Error } from '@src/components/error';
import { useSearchParams } from 'react-router';

const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const paramKeyword = searchParams.get('keyword') ?? undefined;
    const paramGroupId = searchParams.get('groupId') ?? undefined;
    const paramPage = parseInt(searchParams.get('page') ?? '1', 10);

    const pageNumber = isNaN(paramPage) || paramPage < 1 ? 1 : paramPage;
    const keyword = paramGroupId === undefined ? paramKeyword : undefined;
    const groupId = paramGroupId;

    const { data, isLoading, error, isError } = useWorkers({
        pageNumber,
        pageSize: 15,
        keyword,
        groupId,
    });

    const updateSearchParams = (values: { keyword?: string; groupId?: string; page?: number }) => {
        const params = new URLSearchParams();
        if (values.keyword !== undefined && values.keyword !== '') {
            params.set('keyword', values.keyword);
        }
        if (values.groupId !== undefined && values.groupId !== '') {
            params.set('groupId', values.groupId);
        }
        if (values.page !== undefined && values.page > 1) {
            params.set('page', String(values.page));
        }

        setSearchParams(params);
    };

    const handlePageChange = (nextPage: number) => {
        updateSearchParams({ keyword, groupId, page: nextPage });
    };

    return (
        <Container className={styles.home}>
            <WorkerSearchBar
                onSearch={(keyword, groupId) => {
                    updateSearchParams({ keyword, groupId, page: 1 });
                }}
                defaultKeyword={keyword}
                defaultGroupId={groupId}
                disabled={isLoading}
            />

            {(() => {
                if (isError) {
                    return <Error compact message={error.message ?? 'An unknown error'} />;
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
                onPageChange={handlePageChange}
            />
        </Container>
    );
};

export default HomePage;
