import { IconButton } from '@src/components/icon-button';
import { type FC } from 'react';
import { Form } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { BsBoxArrowInRight } from 'react-icons/bs';

type Inputs = {
    username: string;
    password: string;
};

const LoginLocalForm: FC<{ onSubmit: SubmitHandler<Inputs>; label: string; disabled?: boolean }> = ({
    onSubmit,
    label,
    disabled = false,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Control
                disabled={disabled}
                isInvalid={!!errors.username}
                type="text"
                placeholder="Username"
                {...register('username', { required: true })}
            />
            <Form.Control
                disabled={disabled}
                isInvalid={!!errors.password}
                type="password"
                placeholder="Password"
                {...register('password', { required: true })}
            />
            <IconButton disabled={disabled} type="submit" icon={<BsBoxArrowInRight />}>
                {label}
            </IconButton>
        </Form>
    );
};

export default LoginLocalForm;
