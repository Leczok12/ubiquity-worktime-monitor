import { Box, Button, Input } from '@chakra-ui/react';
import { useEffect, type FC } from 'react';
import { useForm } from 'react-hook-form';

type LoginFormInput = {
    username: string;
    password: string;
};

const LoginForm: FC<{
    onSubmit: (data: LoginFormInput) => void;
    onError: (error: string | undefined) => void;
    disabled?: boolean;
}> = ({ onSubmit, onError, disabled = false }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInput>({});

    useEffect(() => {
        if (errors.username) {
            onError(errors.username.message || 'Username is required');
        } else if (errors.password) {
            onError(errors.password.message || 'Password is required');
        } else {
            onError(undefined);
        }
    }, [errors]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={4}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Input
                disabled={disabled}
                placeholder="Username"
                {...register('username', { required: 'Username is required' })}
            />
            <Input
                disabled={disabled}
                placeholder="Password"
                type="password"
                {...register('password', { required: 'Password is required' })}
            />
            <Button variant="subtle" type="submit" disabled={disabled}>
                Login
            </Button>
        </Box>
    );
};

export default LoginForm;
