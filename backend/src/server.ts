import express, { Request, Response, RequestHandler } from 'express';
// Importujemy typ z folderu obok używając aliasu
import { ApiResponse, Product } from '@shared/common';

import { config } from './config/config';
import { log } from './utils/log';
import logger from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
import { workerRouter } from './routers/worker-router';
import { initialize } from './config/initialize';

const startServer = async () => {
    try {
        await initialize();

        const app = express();
        app.use(logger);
        app.get('/', (req: Request, res: Response) => {
            const response: ApiResponse = {
                status: 200,
                message: 'Działa!',
                data: { id: '1', name: 'Laptop', price: 3500 } as Product,
            };
            res.status(response.status).json(response);
        });
        app.use('/api/worker', workerRouter);
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
