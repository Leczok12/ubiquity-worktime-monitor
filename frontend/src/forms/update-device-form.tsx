import type { ApiAdminDeviceType, ApiAdminGetDeviceResponse } from '@shared/api-admin-device';
import { type FC } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { BsPen } from 'react-icons/bs';

type Inputs = {
    type: ApiAdminDeviceType;
};

const UpdateDeviceForm: FC<{
    onSubmit: SubmitHandler<Inputs>;
    data: ApiAdminGetDeviceResponse;
    disabled?: boolean;
}> = ({ onSubmit, data, disabled = false }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({ defaultValues: { type: data.type } });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h5>{data.name}</h5>
            <Form.Select disabled={disabled} isInvalid={!!errors.type} {...register('type', { required: true })}>
                <option value="WORK_START_STOP">Work Start/Stop</option>
                <option value="BREAK_START">Break Start</option>
                <option value="BREAK_STOP">Break Stop</option>
                <option value="UNUSED">Unused</option>
            </Form.Select>
            <Button
                disabled={disabled}
                type="submit"
                variant={(() => {
                    if (data.type === 'WORK_START_STOP') return 'primary';
                    if (data.type === 'BREAK_START') return 'warning';
                    if (data.type === 'BREAK_STOP') return 'warning';
                    return 'dark';
                })()}
            >
                <BsPen />
            </Button>
        </Form>
    );
};

export default UpdateDeviceForm;
