import { useState, type FC } from 'react';
import { SplashScreen } from '../splash-screen';
import { Button, Card, CloseButton, Form, Spinner } from 'react-bootstrap';
import type { ApiWorkEvent } from '@shared/api-work-events';
import { useForm } from 'react-hook-form';
import styles from './work-event-editor.module.scss';
import { BsCheck2, BsCopy, BsPen, BsTrash } from 'react-icons/bs';
import { apiDeleteWorkEvent } from '@src/api/api-work-events';

type Inputs = {
    type: ApiWorkEvent['type'];
    dateStart: string;
    hourStart: number;
    minuteStart: number;
    dateEnd: string;
    hourEnd: number;
    minuteEnd: number;
};

const WorkEventEditor: FC<{
    show: boolean;
    onHide: () => void;
    onSuccess: () => Promise<void>;
    data?: ApiWorkEvent;
}> = ({ show, onHide, onSuccess, data }) => {
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit = async (data: Inputs) => {
        setUpdating(true);
        console.log(data);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setUpdating(false);
    };

    const onDelete = async () => {
        setDeleting(true);
        try {
            await apiDeleteWorkEvent(data?.id ?? '');
            await onSuccess();
            onHide();
        } catch (error) {
            console.error('Failed to delete work event:', error);
        } finally {
            setDeleting(false);
        }
    };

    const onCopy = async () => {
        if (!data) {
            navigator.clipboard.writeText(`undefined`);
            return;
        }

        navigator.clipboard.writeText(
            `id: ${data.id}, timeStart: ${data.timeStart}, placeStart: ${data.placeStart}, timeEnd: ${data.timeEnd}, placeEnd: ${data.placeEnd}`
        );
    };

    if (!show) {
        return null;
    }

    const disabled = deleting || updating;

    return (
        <SplashScreen onClick={onHide}>
            <Card className={styles.workEventEditor}>
                <Card.Header>
                    Event Editor
                    <CloseButton className="float-end" onClick={onHide} />
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <h6>Type</h6>
                        <Form.Control
                            disabled={disabled}
                            isInvalid={!!errors.type}
                            as="select"
                            defaultValue={data?.type ?? 'WORK'}
                            {...register('type', { required: true })}
                        >
                            <option value="WORK">Work</option>
                            <option value="BREAK">Break</option>
                        </Form.Control>
                        <h6>Start Time</h6>
                        <Form.Group>
                            <Form.Control
                                disabled={disabled}
                                isInvalid={!!errors.dateStart}
                                type="date"
                                defaultValue={data ? new Date(data.timeStart).toISOString().split('T')[0] : undefined}
                                {...register('dateStart', { required: true })}
                            />
                            <Form.Control
                                disabled={disabled}
                                isInvalid={!!errors.hourStart}
                                type="number"
                                min={0}
                                max={23}
                                defaultValue={data ? new Date(data.timeStart).getHours() : 0}
                                {...register('hourStart', { required: true })}
                            />
                            <p>:</p>
                            <Form.Control
                                disabled={disabled}
                                isInvalid={!!errors.minuteStart}
                                type="number"
                                min={0}
                                max={59}
                                defaultValue={data ? new Date(data.timeStart).getMinutes() : 0}
                                {...register('minuteStart', { required: true })}
                            />
                        </Form.Group>
                        <h6>End Time</h6>
                        <Form.Group>
                            <Form.Control
                                disabled={disabled}
                                isInvalid={!!errors.dateEnd}
                                type="date"
                                defaultValue={data ? new Date(data.timeEnd).toISOString().split('T')[0] : undefined}
                                {...register('dateEnd', { required: true })}
                            />
                            <Form.Control
                                disabled={disabled}
                                isInvalid={!!errors.hourEnd}
                                type="number"
                                min={0}
                                max={23}
                                defaultValue={data ? new Date(data.timeEnd).getHours() : 0}
                                {...register('hourEnd', { required: true })}
                            />
                            <p>:</p>
                            <Form.Control
                                disabled={disabled}
                                isInvalid={!!errors.minuteEnd}
                                type="number"
                                min={0}
                                max={59}
                                defaultValue={data ? new Date(data.timeEnd).getMinutes() : 0}
                                {...register('minuteEnd', { required: true })}
                            />
                        </Form.Group>
                        <div>
                            <Button disabled={disabled || !data} variant="danger" onClick={onDelete}>
                                {deleting ? <Spinner animation="border" size="sm" /> : <BsTrash size={30} />}
                            </Button>
                            <Button disabled={disabled} variant="info" onClick={onCopy}>
                                <BsCopy size={30} />
                            </Button>
                            <Button disabled={disabled} variant="primary" type="submit">
                                {updating ? (
                                    <Spinner animation="border" size="sm" />
                                ) : data ? (
                                    <BsPen size={30} />
                                ) : (
                                    <BsCheck2 size={30} />
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </SplashScreen>
    );
    return <div>{show && <div>WorkEventEditor</div>}</div>;
};

export default WorkEventEditor;
