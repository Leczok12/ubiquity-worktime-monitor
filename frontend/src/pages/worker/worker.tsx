import { useParams } from 'react-router';

const WorkerPage = () => {
    const { workerId } = useParams<{ workerId: string }>();

    return (
        <div>
            <h1>Worker Page</h1>
            <p>Worker ID: {workerId}</p>
        </div>
    );
};

export default WorkerPage;
