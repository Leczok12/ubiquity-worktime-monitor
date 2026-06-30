import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from './components/ui/provider';

import './main.css';

import { router } from './router/router';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider>
                <RouterProvider router={router} />
            </Provider>
        </QueryClientProvider>
    </StrictMode>
);
