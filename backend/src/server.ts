import express, { Request, Response, RequestHandler } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import errorHandler from './middlewares/error-handler';

import { passport } from './config/passport/passport';
import { session } from './config/session';
import { createAdmin } from './config/create-admin';

import { logger } from './utils/logger';

import { config } from './services/config/config-service';
import { ubiquitiAccessSync } from './services/ubiquiti-access-sync';

import { groupRouter } from './features/group/group-router';
import { workerRouter } from './features/worker/worker-router';
import { authRouter } from './features/auth/auth-router';
import { ApiError } from './types/api-error';
import { workEventsRouter } from './features/work-events/work-events-router';
import { adminRouter } from './features/admin/admin-router';

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
        app.use('/api/group', groupRouter);
        app.use('/api/worker', workerRouter);
        app.use('/api/work-events', workEventsRouter);
        app.use('/api/admin', adminRouter);

        app.use('/api', (_req, _res) => {
            throw new ApiError(404, 'NOT_FOUND');
        });

        /* Static file serving for frontend */

        const cwd = process.cwd();
        const frontendDistCandidates = [
            path.resolve(cwd, 'backend', 'dist'),
            path.resolve(cwd, 'dist'),
            path.resolve(cwd, 'frontend', 'dist'),
            path.resolve(__dirname, '../../../'),
            path.resolve(__dirname, '../../../../'),
            path.resolve(__dirname, '../../dist'),
            path.resolve(__dirname, '../../../dist'),
            path.resolve(__dirname, '../../../../dist'),
        ];

        const frontendDistPath = frontendDistCandidates.find((candidatePath) => {
            const indexPath = path.join(candidatePath, 'index.html');
            const assetsPath = path.join(candidatePath, 'assets');
            return fs.existsSync(indexPath) && fs.existsSync(assetsPath);
        });

        if (frontendDistPath) {
            app.use(express.static(frontendDistPath));
            app.use((req, res, next) => {
                if (req.path.startsWith('/api')) {
                    next();
                    return;
                }

                res.sendFile(path.join(frontendDistPath, 'index.html'));
            });
        } else {
            logger.warn('Frontend dist not found. Static Vite app serving is disabled.');
        }

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
