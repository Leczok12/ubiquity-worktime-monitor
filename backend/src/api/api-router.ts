import express from 'express';

import { v1Router } from './v1/v1-router';
import { appRouter } from './app/app-router';

const router = express.Router();

router.use('/v1', v1Router);
router.use('/app', appRouter);
// router.use('/auth');

export { router as apiRouter };
