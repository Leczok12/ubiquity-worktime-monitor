import express, { Request, Response, RequestHandler } from 'express';
import { config } from './config/config-old';
import { log } from './utils/log';
import logger from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
import { workerRouter } from './routers/worker-router';
import configManager from './services/config-manager';
import ubiquityAccessSyncManager from './services/ubiquity-access-sync-manager';
import { configRouter } from './routers/config-router';
import { ApiResponse } from '@shared/api-response';
import { ApiError } from './types/api-error';

const startServer = async () => {
    try {
        await configManager.initalize();
        //await ubiquityAccessSyncManager.sync();

        const app = express();
        app.use(express.json());
        app.use(logger);

        app.use('/api/worker', workerRouter);
        app.use('/api/config', configRouter);
        app.get('/dd', () => {
            throw new ApiError(404, 'NOT_FOUND');
        });
        app.use(errorHandler);
        app.listen(config.port, () => {
            log(`Server is running on port ${config.port}`, 'SUCCESS');
        });
    } catch (error) {
        log(`Failed to start server: ${error}`, 'ERROR');
        process.exit(1);
    }
};
startServer();
