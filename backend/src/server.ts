import express, { Request, Response, RequestHandler } from 'express';
import errorHandler from './middlewares/error-handler';
import { passport } from './config/passport/passport';
//import { session } from './config/session';
//import { createAdmin } from './config/create-admin';

import { logger } from '@shared/utils/logger';
import { apiRouter } from './routers/api/api-router';
import loggerMiddleware from './middlewares/logger-middleware';
import { authRouter } from './routers/auth/auth-router';
import { session } from './config/session';
import { ApiError } from './types/api-error';
import { ENV } from '@src/config/enviroment';
// import { config } from './services/config/config-service';
// import { ubiquitiAccessSync } from './services/ubiquiti-access-sync';

// import { groupRouter } from './features/group/group-router';
// import { workerRouter } from './features/worker/worker-router';
// import { authRouter } from './features/auth/auth-router';
// import { ApiError } from './types/api-error';
// import { workEventsRouter } from './features/work-events/work-events-router';
// import { adminRouter } from './features/admin/admin-router';
// import { frontendRouter } from './features/frontend/frontend-router';

const startServer = async () => {
    try {
        // await config.initialize();
        // await ubiquitiAccessSync.initialize();

        //await createAdmin();

        // const port = await config.getValue('SERVER_PORT');
        console.log('Starting server...', process.env.DEV);
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use(session);
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(loggerMiddleware);
        app.use('/api/auth', authRouter);
        app.use('/api', apiRouter);

        // app.use('/api/auth', authRouter);
        // app.use('/api/group', groupRouter);
        // app.use('/api/worker', workerRouter);
        // app.use('/api/work-events', workEventsRouter);
        // app.use('/api/admin', adminRouter);
        // app.use('/api', (_req, _res) => {
        //     throw new ApiError(404, 'NOT_FOUND');
        // });

        // app.use('/', frontendRouter);
        app.use('/', (_req, _res) => {
            throw new ApiError(404, 'NOT_FOUND');
        });

        app.use(errorHandler);

        app.listen(ENV.APP_PORT, () => {
            logger.success(`Server is running on port ${ENV.APP_PORT}`);
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
    }
};
startServer();
