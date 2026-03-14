import { type FC } from 'react';
import { Form } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';

type Inputs = {
    username: string;
    password: string;
};

const LoginLocalForm: FC<{ onSubmit: SubmitHandler<Inputs> }> = ({ onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Control type="text" placeholder="Username" {...register('username', { required: true })} />
            {errors.username && <span className="text-danger">Username is required</span>}
            <Form.Control type="password" placeholder="Password" {...register('password', { required: true })} />
            {errors.password && <span className="text-danger">Password is required</span>}
            <Form.Control type="submit" value="Login" className="mt-4 btn btn-primary" />
        </Form>
    );
};

export default LoginLocalForm;
