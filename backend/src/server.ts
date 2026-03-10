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
import { workerRouter } from './features/worker/api/worker-router';
import { deviceRouter } from './features/device/device-router';
import expressSession from 'express-session';
import passport from 'passport';
import { localStrategy } from './strategies';
import { json } from 'node:stream/consumers';

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
            done(null, { id: '1', username: 'testuser', asdasdasd: 'Asdasdasd' });
        });
        passport.use(localStrategy);

        app.use(logger.middleware.bind(logger));

        app.post('/login', passport.authenticate('local', { session: true }), (req: Request, res: Response) => {
            console.log('Request is authenticated:', req.isAuthenticated());
            console.log(req.user);
            res.status(200).send('Hello, World!');
        });

        app.get('/ddd', (req: Request, res: Response) => {
            console.log('Request is authenticated:', req.user.email);
            console.log('Request is authenticated:', req.isAuthenticated());
        });

        // app.use('/ddd', async (req: Request, res: Response) => {
        //     console.log('Request is authenticated:', req.isAuthenticated());
        //     await passport.authenticate('local', {
        //         successRedirect: '/ddd',
        //         failureRedirect: '/login',
        //     });
        //     console.log('Request is authenticated:', req.isAuthenticated());
        //     console.log(req.isAuthenticated());
        //     console.log(req.user);
        //     res.status(200).send('Hello, World!');
        // });
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
