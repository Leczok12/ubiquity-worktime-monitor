import express from 'express';
import { workerRouter } from './worker-router';
const router = express.Router();

router.use('/worker', workerRouter);

router.use('/', (req, res) => {
    res.send('Welcome to the Ubiquity Worktime Monitor v1API!');
});

export { router as v1Router };
