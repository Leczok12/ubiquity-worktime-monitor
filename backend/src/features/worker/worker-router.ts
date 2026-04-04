import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllWorkers, getWorker, getFindWorkers } from './worker-controller';
import { Request, Response } from 'express';
import { roleCheck } from 'src/utils/role-check';
import permissionCheck from 'src/middlewares/permissions-check';
import { get } from 'node:http';

const router = express.Router();

router.get('/all', permissionCheck('VIEWER'), getAllWorkers);
router.get('/group/:groupId/all', permissionCheck('VIEWER'), getAllWorkers);

router.get('/find', permissionCheck('VIEWER'), getFindWorkers);

router.get('/me', permissionCheck('WORKER'), getWorker);
router.get('/:workerId', permissionCheck('VIEWER'), getWorker);

export { router as workerRouter };
