import type { ApiWorkerResponse } from '@shared/api-worker';
import type { FC } from 'react';
import { Button, ListGroupItem } from 'react-bootstrap';
import styles from './worker-row.module.scss';

const WorkerRow: FC<{ worker: ApiWorkerResponse }> = ({ worker }) => {
    return (
        <ListGroupItem
            className={styles.workerRow}
            onClick={() => {
                console.log('Sdfsdfsdf');
            }}
        >
            <p>
                {worker.name} {worker.lastname}
            </p>
            <p>{worker.email}</p>
            <Button variant="primary" size="sm">
                Edit
            </Button>
        </ListGroupItem>
    );
};

export default WorkerRow;
