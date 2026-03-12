import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllDevices } from './device-controller';

const router = express.Router();

router.get('/all', getAllDevices);

export { router as deviceRouter };
