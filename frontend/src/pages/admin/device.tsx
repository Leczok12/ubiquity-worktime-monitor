import { DeviceRow } from '@src/components/device-row';
import { Error } from '@src/components/error';
import { Loader } from '@src/components/loader';
import { useAdminDevice } from '@src/hooks/use-admin-device';
import { Container, ListGroup } from 'react-bootstrap';
import styles from './admin.module.scss';
import { useState } from 'react';
import { apiAdminUpdateDevice } from '@src/api/api-admin-device';
import type { ApiAdminDeviceType } from '@shared/api-admin-device';
import { Pagination } from '@src/components/pagination';
import { SettingsHero } from '@src/components/setting-hero';

const DevicePage = () => {
    const [pageNumber, setPageNumber] = useState(1);

    const { data, isLoading, error, isError, refetch } = useAdminDevice(pageNumber, 10);
    const [disabled, setDisabled] = useState(false);

    const updateDevice = async (id: string, type: ApiAdminDeviceType) => {
        setDisabled(true);
        await apiAdminUpdateDevice(id, { type: type });
        await refetch();
        setDisabled(false);
    };

    if (isError) {
        return <Error message={error.message} />;
    }

    if (isLoading || data === undefined) {
        return <Loader />;
    }

    return (
        <Container className={styles.device}>
            <SettingsHero title="Device Management" />
            <ListGroup>
                {data.data &&
                    data.data.map((device) => (
                        <DeviceRow
                            key={device.id}
                            data={device}
                            onUpdate={(e) => updateDevice(device.id, e)}
                            disabled={disabled}
                        />
                    ))}
            </ListGroup>
            <Pagination
                pageNumber={data?.pagination?.page ?? 1}
                totalPages={Math.ceil((data?.pagination?.total ?? 1) / (data?.pagination?.pageSize ?? 1))}
                onPageChange={(page) => setPageNumber(page)}
            />
        </Container>
    );
};

export default DevicePage;
