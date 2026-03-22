import { Loader } from '@src/components/loader';
import { useWorker } from '@src/hooks/use-worker';
import { Card, Container } from 'react-bootstrap';
import { useParams } from 'react-router';
import styles from './worker.module.scss';
import { WorkerHero } from '@src/components/worker-hero';

const WorkerPage = () => {
    const { workerId } = useParams<{ workerId: string }>();
    const { data, isLoading, error, isError } = useWorker({ workerId: workerId ?? '' });

    if (isLoading || data?.data === undefined) {
        return <Loader />;
    }

    return (
        <Container className={styles.worker}>
            <WorkerHero worker={data.data} />
            <Card>
                <Card.Header>Details</Card.Header>
                <Card.Body>
                    <p>Email: {data.data.email}</p>
                    <p>Active: {data.data.active ? 'Yes' : 'No'}</p>
                    <p>Sync: {data.data.sync ? 'Yes' : 'No'}</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default WorkerPage;
