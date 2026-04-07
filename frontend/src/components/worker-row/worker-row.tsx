import type { ApiGetWorkerResponse } from '@shared/api-worker';
import type { FC } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import styles from './worker-row.module.scss';
import { useNavigate } from 'react-router';

const WorkerRow: FC<{ worker: ApiGetWorkerResponse }> = ({ worker }) => {
    const navigateor = useNavigate();

    return (
        <ListGroupItem action className={styles.workerRow}>
            <div
                onClick={() => {
                    navigateor('/worker/' + worker.id);
                }}
            >
                <p>
                    {worker.name} {worker.lastname}
                </p>
                {/* <p>{worker.email}</p> */}
            </div>

            {/* <Button variant="outline-primary" size="sm">
                <BsStarFill size={20} />
            </Button> */}
        </ListGroupItem>
    );
};

export default WorkerRow;
