import express, { Request, Response, RequestHandler } from 'express';
import errorHandler from './middlewares/error-handler';
import { passport } from './config/passport/passport';

import { logger } from '@src/utils/logger';
import { apiRouter } from './routers/api/api-router';
import loggerMiddleware from './middlewares/logger-middleware';
import { authRouter } from './routers/auth/auth-router';
import { session } from './config/session';
import { ApiError } from './types/api-error';
import { ENV } from '@src/config/enviroment';
import { taskQueue } from './services/task-queue';
import { ubiquitiAccess } from './services/ubiquiti-access';
import { initAdmin } from './utils/init-admin';
import { appRouter } from './routers/app/app-router';
import path from 'path';

const startServer = async () => {
    try {
        await initAdmin();
        if (await ubiquitiAccess.chealthCheck()) {
            if (ENV.UBIQUITI_SYNC_ON_STARTUP) {
                taskQueue.createImmediateTask(
                    'Ubiquiti Access Full Sync',
                    ubiquitiAccess.fullSync.bind(ubiquitiAccess)
                );
            }
            taskQueue.createTask(
                'Ubiquiti Access Full Sync',
                ENV.UBIQUITI_FULL_SYNC_CRON,
                ubiquitiAccess.fullSync.bind(ubiquitiAccess)
            );
            taskQueue.createTask(
                'Ubiquiti Access Partial Sync',
                ENV.UBIQUITI_PARTIAL_SYNC_CRON,
                ubiquitiAccess.partialSync.bind(ubiquitiAccess)
            );
        }
        const app = express();
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use(session);
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(loggerMiddleware);
        app.use('/api/auth', authRouter);
        app.use('/api', apiRouter);
        app.use('/', appRouter);

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
