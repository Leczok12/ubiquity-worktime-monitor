import { useEffect, useState, type FC } from 'react';
import { SplashScreen } from '../splash-screen';
import { Alert, Button, Card, CloseButton, Form, Spinner } from 'react-bootstrap';
import type { ApiWorkEvent } from '@shared/api-work-events';
import { useForm } from 'react-hook-form';
import styles from './work-event-editor.module.scss';
import { BsCheck2, BsCopy, BsPen, BsTrash } from 'react-icons/bs';
import { apiCreateWorkEvent, apiDeleteWorkEvent, apiUpdateWorkEvent } from '@src/api/api-work-events';

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
    workerId?: string;
}> = ({ show, onHide, onSuccess, data, workerId }) => {
    const [deleting, setDeleting] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        return () => {
            console.log('Cleaning up WorkEventEditor state');
            setDeleting(false);
            setUpdating(false);
            setError(undefined);
        };
    }, [show]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    useEffect(() => {
        if (!show) {
            return;
        }

        const timeStart = data ? new Date(data.timeStart) : new Date();
        const timeEnd = data ? new Date(data.timeEnd) : new Date();

        reset({
            type: data?.type ?? 'WORK',
            dateStart: `${timeStart.getFullYear()}-${(timeStart.getMonth() + 1).toString().padStart(2, '0')}-${timeStart.getDate().toString().padStart(2, '0')}`,
            hourStart: timeStart.getHours(),
            minuteStart: timeStart.getMinutes(),
            dateEnd: `${timeEnd.getFullYear()}-${(timeEnd.getMonth() + 1).toString().padStart(2, '0')}-${timeEnd.getDate().toString().padStart(2, '0')}`,
            hourEnd: timeEnd.getHours(),
            minuteEnd: timeEnd.getMinutes(),
        });
    }, [data, show, reset]);

    const onSubmit = async (formData: Inputs) => {
        setUpdating(true);
        try {
            const startTime = new Date(
                `${formData.dateStart}T${formData.hourStart.toString().padStart(2, '0')}:${formData.minuteStart
                    .toString()
                    .padStart(2, '0')}:00`
            );
            const endTime = new Date(
                `${formData.dateEnd}T${formData.hourEnd.toString().padStart(2, '0')}:${formData.minuteEnd
                    .toString()
                    .padStart(2, '0')}:00`
            );

            if (data) {
                await apiUpdateWorkEvent(data.id, {
                    timeStart: startTime.toISOString(),
                    timeEnd: endTime.toISOString(),
                    type: formData.type,
                });
            } else {
                await apiCreateWorkEvent(workerId ?? '', {
                    timeStart: startTime.toISOString(),
                    timeEnd: endTime.toISOString(),
                    type: formData.type,
                });
            }

            await onSuccess();
            onHide();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setUpdating(false);
        }
    };

    const onDelete = async () => {
        setDeleting(true);
        try {
            await apiDeleteWorkEvent(data?.id ?? '');
            await onSuccess();
            onHide();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
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
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <h6>Type</h6>
                        <Form.Control
                            disabled={disabled}
                            isInvalid={!!errors.type}
                            as="select"
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
                                {...register('dateStart', { required: true })}
                            />
                            <Form.Control
                                disabled={disabled}
                                isInvalid={!!errors.hourStart}
                                type="number"
                                min={0}
                                max={23}
                                {...register('hourStart', { required: true })}
                            />
                            <p>:</p>
                            <Form.Control
                                disabled={disabled}
                                isInvalid={!!errors.minuteStart}
                                type="number"
                                min={0}
                                max={59}
                                {...register('minuteStart', { required: true })}
                            />
                        </Form.Group>
                        <h6>End Time</h6>
                        <Form.Group>
                            <Form.Control
                                disabled={disabled}
                                isInvalid={!!errors.dateEnd}
                                type="date"
                                {...register('dateEnd', { required: true })}
                            />
                            <Form.Control
                                disabled={disabled}
                                isInvalid={!!errors.hourEnd}
                                type="number"
                                min={0}
                                max={23}
                                {...register('hourEnd', { required: true })}
                            />
                            <p>:</p>
                            <Form.Control
                                disabled={disabled}
                                isInvalid={!!errors.minuteEnd}
                                type="number"
                                min={0}
                                max={59}
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
