import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './main.css';

import { router } from './router/router';
import { RouterProvider } from 'react-router';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
