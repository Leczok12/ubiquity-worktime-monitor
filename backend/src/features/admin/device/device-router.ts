import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllDevices, setDeviceType } from './device-controller';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/all', getAllDevices);

router.post('/', setDeviceType);

export { router as deviceRouter };
