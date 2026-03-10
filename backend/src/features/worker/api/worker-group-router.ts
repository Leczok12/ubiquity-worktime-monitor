import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllWorkersInGroup } from '../controllers/worker-group-controller';

const router = express.Router();

router.get('/:id/all', getAllWorkersInGroup);

router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as workerGroupRouter };
