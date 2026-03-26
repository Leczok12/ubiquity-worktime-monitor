import { type FC } from 'react';
// import styles from './work-day-search-bar.module.scss';
import SearchWorkDayForm from '@src/forms/search-work-day-from';

const WorkDaySearchBar: FC<{
    onSearch: ({ since, until }: { since: Date; until: Date }) => void;
    disabled?: boolean;
}> = ({ onSearch, disabled = false }) => {
    return (
        <div>
            <SearchWorkDayForm disabled={disabled} onSubmit={onSearch} />
        </div>
    );
};

export default WorkDaySearchBar;
