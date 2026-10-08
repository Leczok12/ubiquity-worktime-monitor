import express from 'express';
import { workerRouter } from './worker-router';
import { groupRouter } from './group-router';
import { deviceRouter } from './device-router';
import { workEventRouter } from './work-event-router';
import { eventRouter } from './event-router';
import { statisticsRouter } from './statistics-router';
import { configRouter } from './config-router';
import { userRouter } from './user-router';

const router = express.Router();

router.use('/device', deviceRouter);
router.use('/event', eventRouter);
router.use('/work-event', workEventRouter);
router.use('/group', groupRouter);
router.use('/statistics', statisticsRouter);
router.use('/worker', workerRouter);
router.use('/config', configRouter);
router.use('/user', userRouter);

export { router as apiRouter };
