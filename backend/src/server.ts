import express, { Request, Response, RequestHandler } from 'express';
import errorHandler from './middlewares/error-handler';

import { passport } from './config/passport';
import { session } from './config/session';

import { logger } from './utils/logger';

import { config } from './services/config/config-service';
import { ubiquitiAccessSync } from './services/ubiquiti-access-sync';

import { configRouter } from './features/config/config-router';
import { groupRouter } from './features/group/group-router';
import { workerRouter } from './features/worker/api/worker-router';
import { deviceRouter } from './features/device/device-router';
import { authRouter } from './features/auth/auth-router';
import { database } from './services/database';
import argon2 from 'argon2';

const startServer = async () => {
    try {
        await config.initialize();
        await ubiquitiAccessSync.initialize();

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

        app.use(errorHandler);
        app.listen(port, () => {
            logger.success(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error instanceof Error ? error.message : error);
        // logger.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
};
startServer();
