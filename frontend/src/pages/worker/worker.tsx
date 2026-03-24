import { Loader } from '@src/components/loader';
import { useWorker } from '@src/hooks/use-worker';
import { Container, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router';
import styles from './worker.module.scss';
import { WorkerHero } from '@src/components/worker-hero';
import { useWorkEvents } from '@src/hooks/use-work-events';
import { WorkEvent } from '@src/components/work-event';

const WorkerPage = () => {
    const { workerId } = useParams<{ workerId: string }>();
    const { data, isLoading, error, isError } = useWorker({ workerId: workerId ?? '' });
    const { data: workEventsData } = useWorkEvents(
        workerId ?? '',
        new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 50),
        new Date()
    );

    if (isLoading || data?.data === undefined) {
        return <Loader />;
    }

    return (
        <Container className={styles.worker}>
            <WorkerHero worker={data.data} />
            <ListGroup>
                {workEventsData?.events.map((event, index) => (
                    <WorkEvent key={index} event={event} />
                ))}
            </ListGroup>
        </Container>
    );
};

export default WorkerPage;
