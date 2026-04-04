import express from 'express';
import { createWorkerWorkEvent, deleteWorkEvent, getWorkerWorkEvents, updateWorkEvent } from './work-events-controller';
import permissionCheck from 'src/middlewares/permissions-check';

const router = express.Router();

router.get('/worker/me', permissionCheck('WORKER'), getWorkerWorkEvents);

router.get('/worker/:workerId', permissionCheck('VIEWER'), getWorkerWorkEvents);

router.post('/worker/:workerId', permissionCheck('MANAGER'), createWorkerWorkEvent);
router.put('/:workEventId', permissionCheck('MANAGER'), updateWorkEvent);
router.delete('/:workEventId', permissionCheck('MANAGER'), deleteWorkEvent);

export { router as workEventsRouter };
