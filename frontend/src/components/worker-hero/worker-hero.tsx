import type { FC } from 'react';
import { Card, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { BsCircleFill } from 'react-icons/bs';
import styles from './worker-hero.module.scss';
import { useWorker } from '@src/hooks/use-worker';

const WorkerHero: FC<{ workerId: string; onError: (error: Error) => void }> = ({ workerId, onError }) => {
    const { data, isLoading, error, isError } = useWorker({ workerId });

    if (isError) {
        onError(error ?? new Error('Unknown error'));
        return null;
    }

    return (
        <Card className={styles.workerHero}>
            {data?.data === undefined || isLoading ? (
                <Card.Body className={styles.loading}>
                    <Spinner animation="border" role="status" />
                </Card.Body>
            ) : (
                <Card.Body className={styles.content}>
                    <h1>
                        {data.data.name} {data.data.lastname}
                    </h1>
                    <p className="text-gray-600">
                        {!data.data.email || data.data.email === '' ? '--@--.--' : data.data.email}
                    </p>
                    <div className={styles.status}>
                        <OverlayTrigger
                            placement="left"
                            delay={{ show: 0, hide: 400 }}
                            overlay={<Tooltip>{data.data.active ? 'Active' : 'Inactive'}</Tooltip>}
                        >
                            <BsCircleFill fill={data.data.active ? 'var(--bs-success)' : 'var(--bs-danger)'} />
                        </OverlayTrigger>
                    </div>
                </Card.Body>
            )}
        </Card>
    );
};

export default WorkerHero;
