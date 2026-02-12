import express from 'express';
import { getWorker } from 'src/controllers/worker-controller';
import { ApiError } from 'src/types/api-error';

const router = express.Router();

router.use(() => {
    throw new ApiError(403, 'Access prohibited.');
});
router.get('/:id', getWorker);
router.all('/', () => {
    throw new ApiError(404, 'Missing id');
});

export { router as workerRouter };
