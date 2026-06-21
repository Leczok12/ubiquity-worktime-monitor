import express from 'express';
import { microsoftRouter } from './microsoft-router';

const router = express.Router();

// router.use('/local', groupRouter);
if (process.env.MICROSOFT_ENABLED === 'true') {
    router.use('/microsoft', microsoftRouter);
}

export { router as authRouter };
