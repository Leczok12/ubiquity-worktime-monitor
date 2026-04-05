import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllDevices, setDeviceType } from './device-controller';
import { Request, Response } from 'express';
import { roleCheck } from 'src/utils/role-check';

const router = express.Router();

router.use((req: Request, res: Response, next: Function) => {
    roleCheck(req, 'SYSTEM_ADMIN');
    next();
});

router.get('/all', getAllDevices);

router.post('/', setDeviceType);

export { router as deviceRouter };
