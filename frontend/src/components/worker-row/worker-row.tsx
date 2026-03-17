import type { ApiWorkerResponse } from '@shared/api-worker';
import type { FC } from 'react';
import { Button, ListGroupItem } from 'react-bootstrap';
import styles from './worker-row.module.scss';
import { BsStar, BsStarFill } from 'react-icons/bs';

const WorkerRow: FC<{ worker: ApiWorkerResponse; onClick: () => void }> = ({ worker, onClick }) => {
    return (
        <ListGroupItem className={styles.workerRow}>
            <div onClick={onClick}>
                <p>
                    {worker.name} {worker.lastname}
                </p>
                <p>{worker.email}</p>
            </div>

            <Button variant="outline-primary" size="sm">
                <BsStarFill size={20} />
            </Button>
        </ListGroupItem>
    );
};

export default WorkerRow;
