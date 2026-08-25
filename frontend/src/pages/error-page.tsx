import { useRouteError } from 'react-router';

const ErrorPage = () => {
    const error = useRouteError() as Error | null;

    return (
        <div>
            <h1>Error</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>{error?.message}</p>
        </div>
    );
};

export default ErrorPage;
