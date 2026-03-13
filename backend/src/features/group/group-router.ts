import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllGroups } from './group-controller';
import { Request, Response } from 'express';
import { roleCheck } from 'src/utils/role-check';

const router = express.Router();

router.use((req: Request, res: Response, next: Function) => {
    roleCheck(req, 'VIEWER');
    next();
});

router.get('/all', getAllGroups);

export { router as groupRouter };
