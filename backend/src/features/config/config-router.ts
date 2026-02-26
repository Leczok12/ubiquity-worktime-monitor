import express from 'express';
import { getAllConfig, setValue } from 'src/controllers/config-controller';
import { ApiError } from 'src/types/api-error';

const router = express.Router();

router.get('/', getAllConfig);
router.post('/', setValue);
router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as configRouter };
