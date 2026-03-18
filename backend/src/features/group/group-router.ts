import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllGroups, getAllWorkersInGroup } from './group-controller';
import { Request, Response } from 'express';
import { roleCheck } from 'src/utils/role-check';

const router = express.Router();

router.use((req: Request, res: Response, next: Function) => {
    roleCheck(req, 'VIEWER');
    next();
});

router.get('/all', getAllGroups);

router.get('/:id/worker/all', getAllWorkersInGroup);

export { router as groupRouter };
