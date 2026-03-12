import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllGroups } from './group-controller';

const router = express.Router();

router.get('/all', getAllGroups);

export { router as groupRouter };
