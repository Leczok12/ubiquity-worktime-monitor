import { appController } from '@src/controllers/app-controller';
import express from 'express';
import path from 'path';

const router = express.Router();

router.get(/(.*)/, appController().getAppStatic);
router.get(/(.*)/, appController().getApp);

export { router as appRouter };
