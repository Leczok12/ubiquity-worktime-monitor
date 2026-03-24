import express from 'express';
import { Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';
import { roleCheck } from 'src/utils/role-check';
import { getWorkerWorkEvents } from './work-events-controller';

const router = express.Router();

router.get('/:id', getWorkerWorkEvents);

export { router as workEventsRouter };
