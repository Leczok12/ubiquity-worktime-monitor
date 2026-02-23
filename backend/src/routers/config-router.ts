import express from 'express';
import { getAllConfig, getValue, setValue } from 'src/controllers/config-controller';
import { ApiError } from 'src/types/api-error';

const router = express.Router();

// router.use(() => {

// });
router.get('/all', getAllConfig);
router.get('/:key', getValue);
router.put('/:key', setValue);
router.all('/', () => {
    throw new ApiError(404, 'Endpoint not found');
});

export { router as configRouter };
