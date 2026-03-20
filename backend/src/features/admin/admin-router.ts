import express from 'express';
import { ApiError } from 'src/types/api-error';
import { Request, Response } from 'express';
import { roleCheck } from 'src/utils/role-check';

const router = express.Router();

router.use((req: Request, res: Response, next: Function) => {
    roleCheck(req, 'SYSTEM_ADMIN');
    next();
});

// router.get('/worker', getAllWorkers);
// router.get('/find', findWorkers);
// router.get('/:id', getWorkerById);
// router.post('/:id', postWorkerById);

export { router as workerRouter };
