import express from 'express';
import { Request, Response } from 'express';
import { roleCheck } from 'src/utils/role-check';
import permissionCheck from 'src/middlewares/permissions-check';
import { deviceRouter } from './device/device-router';

const router = express.Router();

router.use(permissionCheck('SYSTEM_ADMIN'));

router.use('/device', deviceRouter);

export { router as adminRouter };
