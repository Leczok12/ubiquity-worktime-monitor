import express from 'express';
import { Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';
import { roleCheck } from 'src/utils/role-check';
import { createWorkEvent, deleteWorkEvent, getWorkerWorkEvents, updateWorkEvent } from './work-events-controller';

const router = express.Router();

router.get('/worker/:id', getWorkerWorkEvents);
router.delete('/:id', deleteWorkEvent);
router.put('/:id', updateWorkEvent);
router.post('/', createWorkEvent);
export { router as workEventsRouter };
