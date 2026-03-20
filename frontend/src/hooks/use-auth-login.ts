import type { ApiAuthLoginLocalRequest } from '@shared/api-auth';
import { apiAuthLocalLogin } from '@src/api/api-auth-local-login';
import { useState } from 'react';

export const useAuthLogin = (onSuccess: () => void) => {
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | undefined>(undefined);

    const loginLocal = async (credentials: ApiAuthLoginLocalRequest) => {
        setIsError(false);
        setError(undefined);
        setIsLoading(true);

        await apiAuthLocalLogin(credentials)
            .then(() => {
                onSuccess();
            })
            .catch((err) => {
                setIsError(true);
                if (err instanceof Error) {
                    if (err.message === 'INVALID_CREDENTIALS') {
                        setError(new Error('Invalid username or password'));
                    } else {
                        setError(err);
                    }
                } else {
                    setError(new Error('Unknown error'));
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return { loginLocal, isLoading, isError, error };
};
