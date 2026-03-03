import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllConfig, setConfigValue } from './config-controller';

const router = express.Router();

router.get('/all', getAllConfig);
router.post('/', setConfigValue);
router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as configRouter };
