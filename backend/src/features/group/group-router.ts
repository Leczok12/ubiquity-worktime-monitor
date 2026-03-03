import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllGroups } from './group-controller';

const router = express.Router();

router.get('/all', getAllGroups);
router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as groupRouter };
