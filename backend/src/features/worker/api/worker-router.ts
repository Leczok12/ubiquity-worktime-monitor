import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllWorkers, findWorkers } from '../controllers/worker-controller';
import { workerGroupRouter } from './worker-group-router';

const router = express.Router();

router.get('/all', getAllWorkers);
router.get('/find', findWorkers);

router.use('/group', workerGroupRouter);

router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as workerRouter };
