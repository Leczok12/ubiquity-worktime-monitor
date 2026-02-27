import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllConfig, setConfigValue } from './config-controler';

const router = express.Router();

router.get('/', getAllConfig);
router.post('/', setConfigValue);
router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as configRouter };
