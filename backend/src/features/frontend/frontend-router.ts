import express from 'express';
import { getFrontend, getFrontendStatic } from './frontend-controller';

const router = express.Router();

router.get(/(.*)/, getFrontendStatic);
router.get(/(.*)/, getFrontend);

export { router as frontendRouter };
