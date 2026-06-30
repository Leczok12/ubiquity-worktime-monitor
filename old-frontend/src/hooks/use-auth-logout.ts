import { apiAuthLogout } from '@src/api/api-auth-logout';
import { useState } from 'react';

export const useAuthLogout = (
    onSuccess: () => void
): {
    logout: () => Promise<void>;
    isError: boolean;
    error: Error | undefined;
} => {
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | undefined>(undefined);

    const logout = async () => {
        setIsError(false);
        setError(undefined);

        try {
            await apiAuthLogout();
            onSuccess();
        } catch (err) {
            setIsError(true);
            setError(err as Error);
        }
    };

    return { logout, isError, error };
};
