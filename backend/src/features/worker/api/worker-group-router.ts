import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllWorkersInGroup } from '../controllers/worker-group-controller';

const router = express.Router();

router.get('/:id/all', getAllWorkersInGroup);

export { router as workerGroupRouter };
