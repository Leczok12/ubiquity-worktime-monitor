import express, { Request, Response, RequestHandler } from 'express';
// import { log } from './utils/log';
// import logger from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
// import { workerRouter } from './routers/worker-router';
// import { configRouter } from './routers/config-router';
// import { ApiResponse } from '@shared/api-response';
// import { ApiError } from './types/api-error';
import { config } from './services/config/config-service';
import { exit } from 'node:process';
import { logger } from './utils/logger';
import { configRouter } from './features/config/config-router';
import { ubiquitiAccessSync } from './services/ubiquiti-access-sync';
import { groupRouter } from './features/group/group-router';
import { workerRouter } from './features/worker/worker-router';
import { deviceRouter } from './features/device/device-router';

const startServer = async () => {
    try {
        await config.initialize();
        await ubiquitiAccessSync.initialize();

        const port = await config.getValue('SERVER_PORT');

        const app = express();
        app.use(express.json());
        app.use(logger.middleware.bind(logger) as RequestHandler);

        // app.use('/api/worker', workerRouter);
        app.use('/api/config', configRouter);
        app.use('/api/group', groupRouter);
        app.use('/api/worker', workerRouter);
        app.use('/api/device', deviceRouter);
        // app.get('/dd', () => {
        //     throw new ApiError(404, 'NOT_FOUND');
        // });
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
