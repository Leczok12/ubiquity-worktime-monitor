import { createContext } from 'react';
import { type ApiAuthUser } from '@shared/types/api/api-auth';

export const UserContext = createContext<ApiAuthUser | undefined>(undefined);
