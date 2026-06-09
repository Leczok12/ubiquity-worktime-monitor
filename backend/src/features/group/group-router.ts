import express from 'express';
import { getAllGroups } from './group-controller';
import permissionCheck from '@src/middlewares/permissions-check';

const router = express.Router();

router.get('/all', permissionCheck('VIEWER'), getAllGroups);

export { router as groupRouter };
