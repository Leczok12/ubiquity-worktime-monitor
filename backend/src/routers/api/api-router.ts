import express from 'express';
import { workerRouter } from './worker-router';
import { groupRouter } from './group-router';
import { deviceRouter } from './device-router';
import { eventRouter } from './event-router';
import { statisticsRouter } from './statistics-router';
import { authorizerMiddleware } from '@src/middlewares/authorizer-middleware';
import { $Enums } from '@prisma/client';

const router = express.Router();

router.use('/device', deviceRouter);
router.use('/event', eventRouter);
router.use('/group', groupRouter);
router.use('/statistics', statisticsRouter);
router.use('/worker', workerRouter);

export { router as apiRouter };
