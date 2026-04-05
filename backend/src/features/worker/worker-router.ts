import express from 'express';
import { getAllWorkers, getWorker, getFindWorkers } from './worker-controller';
import permissionCheck from 'src/middlewares/permissions-check';

const router = express.Router();

router.get('/all', permissionCheck('VIEWER'), getAllWorkers);
router.get('/group/:groupId/all', permissionCheck('VIEWER'), getAllWorkers);

router.get('/find', permissionCheck('VIEWER'), getFindWorkers);

router.get('/me', permissionCheck('WORKER'), getWorker);
router.get('/:workerId', permissionCheck('VIEWER'), getWorker);

export { router as workerRouter };
