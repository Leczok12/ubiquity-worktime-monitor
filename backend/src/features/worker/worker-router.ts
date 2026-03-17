import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllWorkers, findWorkers, getAllWorkersInGroup } from './worker-controller';
import { Request, Response } from 'express';
import { roleCheck } from 'src/utils/role-check';

const router = express.Router();

router.use((req: Request, res: Response, next: Function) => {
    roleCheck(req, 'VIEWER');
    next();
});

router.get('/all', getAllWorkers);
router.get('/find', findWorkers);
router.get('/group/:id', getAllWorkersInGroup);

export { router as workerRouter };
