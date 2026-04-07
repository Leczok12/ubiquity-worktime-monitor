import type { ApiGetWorkerWorkEventsResponse, ApiWorkEvent } from '@shared/api-work-events';
import { UserContext } from '@src/hooks/use-user-context';
import { useContext, type FC } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import WorkReportItem from './work-report-item';
import { secondsToString } from '@src/utils/seconds-to-string';
import styles from './work-report.module.scss';
import { dateToString } from '@src/utils/date-to-string';

const WorkReport: FC<{
    data: ApiGetWorkerWorkEventsResponse;
    onEdit: (event?: ApiWorkEvent, defaultData?: Date) => void;
}> = ({ data, onEdit }) => {
    const user = useContext(UserContext);

    if (data.days.length === 0 || !user) {
        return null;
    }

    return (
        <ListGroup className={styles.workReport}>
            <ListGroupItem className={styles.workReportHeader}>
                <h6>
                    {'Report: '}
                    {dateToString([new Date(data.days[data.days.length - 1].dayStart), new Date(data.days[0].dayEnd)])}
                </h6>
                <p>{secondsToString(data.seconds)} h</p>
            </ListGroupItem>
            {data.days.map((day) => (
                <WorkReportItem
                    key={day.dayStart}
                    day={day}
                    onEdit={user.role === 'MANAGER' || user.role === 'SYSTEM_ADMIN' ? onEdit : undefined}
                />
            ))}
        </ListGroup>
    );
};

export default WorkReport;
