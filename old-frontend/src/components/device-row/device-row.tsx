import type { ApiAdminDeviceType, ApiAdminGetDeviceResponse } from '@shared/api-admin-device';
import UpdateDeviceForm from '@src/forms/update-device-form';
import type { FC } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import style from './device-row.module.scss';

const DeviceRow: FC<{
    data: ApiAdminGetDeviceResponse;
    onUpdate: (type: ApiAdminDeviceType) => void;
    disabled?: boolean;
}> = ({ data, onUpdate, disabled = false }) => {
    return (
        <ListGroupItem className={style.deviceRow}>
            <UpdateDeviceForm onSubmit={(values) => onUpdate(values.type)} data={data} disabled={disabled} />
        </ListGroupItem>
    );
};

export default DeviceRow;
