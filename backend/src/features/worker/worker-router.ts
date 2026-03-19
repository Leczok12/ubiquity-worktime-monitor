import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllWorkers, findWorkers, getWorkerById, postWorkerById } from './worker-controller';
import { Request, Response } from 'express';
import { roleCheck } from 'src/utils/role-check';

const router = express.Router();

// router.use((req: Request, res: Response, next: Function) => {
//     roleCheck(req, 'VIEWER');
//     next();
// });

router.get('/all', getAllWorkers);
router.get('/find', findWorkers);
router.get('/:id', getWorkerById);
router.post('/:id', postWorkerById);

export { router as workerRouter };
