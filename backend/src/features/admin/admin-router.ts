import express from 'express';
import permissionCheck from 'src/middlewares/permissions-check';
import { deviceRouter } from './device/device-router';

const router = express.Router();

router.use(permissionCheck('SYSTEM_ADMIN'));

router.use('/device', deviceRouter);

export { router as adminRouter };
