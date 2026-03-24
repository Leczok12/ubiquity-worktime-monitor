import express, { Request, Response, RequestHandler } from 'express';
import errorHandler from './middlewares/error-handler';

import { passport } from './config/passport/passport';
import { session } from './config/session';
import { createAdmin } from './config/create-admin';

import { logger } from './utils/logger';

import { config } from './services/config/config-service';
import { ubiquitiAccessSync } from './services/ubiquiti-access-sync';

import { configRouter } from './features/config/config-router';
import { groupRouter } from './features/group/group-router';
import { workerRouter } from './features/worker/worker-router';
import { deviceRouter } from './features/device/device-router';
import { authRouter } from './features/auth/auth-router';
import { ApiError } from './types/api-error';
import { workEventsRouter } from './features/work-events/work-events-router';

const startServer = async () => {
    try {
        await config.initialize();
        await ubiquitiAccessSync.initialize();

        await createAdmin();

        const port = await config.getValue('SERVER_PORT');

        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use(session);

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(logger.middleware.bind(logger));

        app.use('/api/auth', authRouter);
        app.use('/api/config', configRouter);
        app.use('/api/group', groupRouter);
        app.use('/api/worker', workerRouter);
        app.use('/api/device', deviceRouter);
        app.use('/api/work-events', workEventsRouter);

        app.use((req, res, next) => {
            throw new ApiError(404, 'NOT_FOUND');
        });

        app.use(errorHandler);
        app.listen(port, () => {
            logger.success(`Server is running on port ${port}`);
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
    }
};
startServer();
