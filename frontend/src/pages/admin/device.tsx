import { Error } from '@src/components/error';
import { Loader } from '@src/components/loader';
import { useAdminDevice } from '@src/hooks/use-admin-device';
import { Container } from 'react-bootstrap';

const DevicePage = () => {
    const { data, isLoading, error, isError } = useAdminDevice();

    if (isError) {
        return <Error message={error.message} />;
    }

    if (isLoading || data === undefined) {
        return <Loader />;
    }

    return (
        <Container>
            <h1>Device Page</h1>
            {data &&
                data.map((device) => (
                    <div key={device.id}>
                        <h2>{device.name}</h2>
                        <p>ID: {device.id}</p>
                        <p>Type: {device.type}</p>
                    </div>
                ))}
        </Container>
    );
};

export default DevicePage;
