import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllWorkers, getAllWorkersInGroup, findWorkers } from './worker-controller';

const router = express.Router();

router.get('/group/:id/all', getAllWorkersInGroup);
router.get('/find', findWorkers);
router.get('/all', getAllWorkers);

router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as workerRouter };
