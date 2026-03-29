import { type FC } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { BsSearch } from 'react-icons/bs';

type Inputs = {
    until: string;
    since: string;
};

const SearchWorkDayForm: FC<{
    onSubmit: SubmitHandler<{ until: Date; since: Date }>;
    disabled?: boolean;
    defaultSince: Date;
    defaultUntil: Date;
}> = ({ onSubmit, disabled = false, defaultSince, defaultUntil }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            since: new Date(defaultSince).toISOString().split('T')[0],
            until: new Date(defaultUntil).toISOString().split('T')[0],
        },
    });

    const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
        onSubmit({
            since: new Date(data.since),
            until: new Date(data.until),
        });
    };

    console.log('defaultSince', defaultSince.toLocaleDateString());

    return (
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
            <Form.Control
                disabled={disabled}
                defaultValue={new Date(defaultSince).toLocaleDateString() || new Date().toDateString()}
                isInvalid={!!errors.since}
                type="date"
                placeholder="Since..."
                {...register('since', {})}
            />
            <Form.Control
                disabled={disabled}
                defaultValue={new Date(defaultUntil).toLocaleDateString() || new Date().toDateString()}
                isInvalid={!!errors.until}
                type="date"
                placeholder="Until..."
                {...register('until', {})}
            />

            <Button disabled={disabled} type="submit">
                <BsSearch />
            </Button>
        </Form>
    );
};

export default SearchWorkDayForm;
