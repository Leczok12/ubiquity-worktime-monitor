import { type FC } from 'react';
import styles from './work-day-search-bar.module.scss';
import SearchWorkDayForm from '@src/forms/search-work-day-from';
import { Toast, ToastContainer } from 'react-bootstrap';

const WorkDaySearchBar: FC<{
    onSearch: ({ since, until }: { since: Date; until: Date }) => void;
    defaultRange: { since: Date; until: Date };
    disabled?: boolean;
}> = ({ onSearch, defaultRange, disabled = false }) => {
    return (
        <div className={styles.workDaySearchBar}>
            <SearchWorkDayForm
                disabled={disabled}
                onSubmit={onSearch}
                defaultSince={defaultRange.since}
                defaultUntil={defaultRange.until}
            />
        </div>
    );
};

export default WorkDaySearchBar;
