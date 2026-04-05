import { type FC } from 'react';
import styles from './worker-search-bar.module.scss';
import SearchWorkerForm from '@src/forms/search-worker-from';
import { useGroup } from '@src/hooks/use-group';

const WorkerSearchBar: FC<{
    onSearch: (keyword?: string, groupId?: string) => void;
    disabled?: boolean;
}> = ({ onSearch, disabled = false }) => {
    const { data: groupsData, isLoading: groupsLoading } = useGroup();

    return (
        <div className={styles.workerSearchBar}>
            <SearchWorkerForm
                disabled={disabled || groupsLoading}
                groups={groupsData?.map((group) => ({ id: group.id, name: group.name }))}
                onSubmit={({ keyword, groupId }) => {
                    onSearch(keyword, groupId);
                }}
            />
        </div>
    );
};

export default WorkerSearchBar;
