import { useWorker } from '@src/hooks/use-worker';
import { useParams } from 'react-router';

const WorkerPage = () => {
    const { workerId } = useParams<{ workerId: string }>();
    const { data, isLoading, error, isError } = useWorker({ workerId: workerId ?? '' });
    return (
        <div>
            <h1>Worker Page</h1>
            <p>Worker ID: {JSON.stringify(data?.data)}</p>
        </div>
    );
};

export default WorkerPage;
