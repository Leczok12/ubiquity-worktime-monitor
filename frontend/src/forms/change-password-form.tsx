import { IconButton } from '@src/components/icon-button';
import { type FC } from 'react';
import { Form } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { BsBoxArrowInRight } from 'react-icons/bs';

type Inputs = {
    password: string;
    passwordConfirm: string;
};

const ChangePasswordForm: FC<{ onSubmit: SubmitHandler<Inputs>; disabled?: boolean }> = ({
    onSubmit,
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
                isInvalid={!!errors.password}
                type="password"
                placeholder="Password"
                {...register('password', { required: true })}
            />
            <Form.Control
                disabled={disabled}
                isInvalid={!!errors.passwordConfirm}
                type="password"
                placeholder="Confirm Password"
                {...register('passwordConfirm', { required: true })}
            />
            <IconButton disabled={disabled} type="submit" icon={<BsBoxArrowInRight />}>
                Change Password
            </IconButton>
        </Form>
    );
};

export default ChangePasswordForm;
