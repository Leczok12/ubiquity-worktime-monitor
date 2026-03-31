import express from 'express';
import { Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';
import { roleCheck } from 'src/utils/role-check';
import { deleteWorkEvent, getWorkerWorkEvents, postWorkEvent } from './work-events-controller';

const router = express.Router();

router.get('/worker/:id', getWorkerWorkEvents);
router.delete('/:id', deleteWorkEvent);
router.post('/', postWorkEvent);
export { router as workEventsRouter };
