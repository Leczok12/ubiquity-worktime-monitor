import type { ApiAuthUserResponse } from '@shared/api-auth';
import { createContext } from 'react';

export const UserContext = createContext<ApiAuthUserResponse | undefined>(undefined);
