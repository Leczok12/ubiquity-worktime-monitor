import { type FC } from 'react';
import styles from './worker-search-bar.module.scss';
import SearchWorkerForm from '@src/forms/search-worker-from';

const WorkerSearchBar: FC<{
    onSearch: (keyword?: string, groupId?: string) => void;
    groups: { id: string; name: string }[];
    disabled?: boolean;
}> = ({ onSearch, groups, disabled = false }) => {
    return (
        <div className={styles.workerSearchBar}>
            <SearchWorkerForm
                disabled={disabled}
                groups={groups}
                onSubmit={({ keyword, groupId }) => {
                    onSearch(keyword, groupId);
                }}
            />
        </div>
    );
};

export default WorkerSearchBar;
