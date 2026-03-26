import { Loader } from '@src/components/loader';
import { useWorker } from '@src/hooks/use-worker';
import { Container, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router';
import styles from './worker.module.scss';
import { WorkerHero } from '@src/components/worker-hero';
import { useWorkEvents } from '@src/hooks/use-work-events';
import { WorkDaySearchBar } from '@src/components/work-day-search-bar';
import { useState } from 'react';
import { WorkDay } from '@src/organisms/work-day';

const WorkerPage = () => {
    const { workerId } = useParams<{ workerId: string }>();

    const [searchRange, setSearchRange] = useState<{ since: Date; until: Date }>({
        since: new Date(),
        until: new Date(),
    });

    const { data, isLoading, error, isError } = useWorker({ workerId: workerId ?? '' });
    const { data: workEventsData, isLoading: isWorkEventsLoading } = useWorkEvents(
        workerId ?? '',
        searchRange.since,
        searchRange.until
    );

    if (isLoading || data?.data === undefined) {
        return <Loader />;
    }

    return (
        <Container className={styles.worker}>
            <WorkerHero worker={data.data} />
            <WorkDaySearchBar onSearch={setSearchRange} />

            {isWorkEventsLoading ? (
                <Loader compact />
            ) : (
                <ListGroup>
                    {workEventsData?.days.map((day, index) => (
                        <WorkDay key={index} day={day} />
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default WorkerPage;
