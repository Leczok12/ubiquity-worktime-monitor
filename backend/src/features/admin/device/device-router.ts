import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllDevices, updateDevice } from './device-controller';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/all', getAllDevices);
router.put('/:deviceId', updateDevice);

export { router as deviceRouter };
