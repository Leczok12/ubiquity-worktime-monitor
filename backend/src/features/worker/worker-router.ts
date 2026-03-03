import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllWorkersInGroup } from './worker-controller';

const router = express.Router();

router.get('/group/:id', getAllWorkersInGroup);
router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as workerRouter };
