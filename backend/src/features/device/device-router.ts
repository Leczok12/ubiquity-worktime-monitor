import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllDevices } from './device-controller';

const router = express.Router();

router.get('/all', getAllDevices);
router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as deviceRouter };
