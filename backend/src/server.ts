import express, { Request, Response, RequestHandler } from 'express';
import errorHandler from './middlewares/error-handler';

import passport from 'passport';
import expressSession from 'express-session';

import { localStrategy } from './strategies';
import { logger } from './utils/logger';

import { config } from './services/config/config-service';
import { ubiquitiAccessSync } from './services/ubiquiti-access-sync';

import { configRouter } from './features/config/config-router';
import { groupRouter } from './features/group/group-router';
import { workerRouter } from './features/worker/api/worker-router';
import { deviceRouter } from './features/device/device-router';
import { authRouter } from './features/auth/auth-router';

const startServer = async () => {
    try {
        await config.initialize();
        await ubiquitiAccessSync.initialize();

        const port = await config.getValue('SERVER_PORT');

        const app = express();
        app.use(expressSession({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
        app.use(express.json());

        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser(function (user, done) {
            console.log('Serializing user with id:', user);
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            console.log('Deserializing user with id:', id);
            done(null, {
                id: '1',
                email: 'testuser@example.com',
                name: 'Test User',
                roles: ['EDITOR'],
                lastname: '',
                password: '',
                locked: false,
            });
        });
        passport.use(localStrategy);

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
