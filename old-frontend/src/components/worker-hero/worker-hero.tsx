import type { FC } from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsCircleFill } from 'react-icons/bs';
import styles from './worker-hero.module.scss';
import type { ApiGetWorkerResponse } from '@shared/api-worker';

const WorkerHero: FC<{ worker: ApiGetWorkerResponse }> = ({ worker }) => {
    return (
        <Card className={styles.workerHero}>
            <Card.Body className={styles.content}>
                <h1>
                    {worker.name} {worker.lastname}
                </h1>
                <p className="text-gray-600">{worker.email || '--@--.--'}</p>
                <div className={styles.status}>
                    <OverlayTrigger
                        placement="left"
                        delay={{ show: 0, hide: 400 }}
                        overlay={<Tooltip>{worker.active ? 'Active' : 'Inactive'}</Tooltip>}
                    >
                        <BsCircleFill fill={worker.active ? 'var(--bs-success)' : 'var(--bs-danger)'} />
                    </OverlayTrigger>
                </div>
            </Card.Body>
        </Card>
    );
};

export default WorkerHero;
