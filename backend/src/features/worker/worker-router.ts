import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllWorkers, findWorkers, getWorkerById } from './worker-controller';
import { Request, Response } from 'express';
import { roleCheck } from 'src/utils/role-check';

const router = express.Router();

router.get('/all', getAllWorkers);
router.get('/find', findWorkers);
router.get('/:id', getWorkerById);

export { router as workerRouter };
