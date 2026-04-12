import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllDevices, updateDevices } from './device-controller';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/all', getAllDevices);
router.put('/', updateDevices);

export { router as deviceRouter };
