import type { ApiWorkerResponse } from '@shared/api-worker';
import type { FC } from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsCircleFill } from 'react-icons/bs';
import styles from './worker-hero.module.scss';

const WorkerHero: FC<{ worker: ApiWorkerResponse }> = ({ worker }) => {
    return (
        <Card className={styles.workerHero}>
            <Card.Body>
                <div>
                    <h1>
                        {worker.name} {worker.lastname}
                    </h1>
                    <p className="text-gray-600">{!worker.email || worker.email === '' ? '--@--.--' : worker.email}</p>
                </div>
                <OverlayTrigger
                    placement="left"
                    delay={{ show: 0, hide: 400 }}
                    overlay={<Tooltip>{worker.active ? 'Active' : 'Inactive'}</Tooltip>}
                >
                    <BsCircleFill fill={worker.active ? 'var(--bs-success)' : 'var(--bs-danger)'} />
                </OverlayTrigger>
            </Card.Body>
        </Card>
    );
};

export default WorkerHero;
