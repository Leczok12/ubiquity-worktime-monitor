import express from 'express';
import { workerRouter } from './worker-router';
import { groupRouter } from './group-router';
import { deviceRouter } from './device-router';
import { eventRouter } from './event-router';

const router = express.Router();

router.use('/worker', workerRouter);
router.use('/group', groupRouter);
router.use('/device', deviceRouter);
router.use('/event', eventRouter);

router.use('/', (req, res) => {
    res.send('Welcome to the Ubiquity Worktime Monitor v1API!');
});

export { router as apiRouter };
