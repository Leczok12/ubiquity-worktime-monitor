import express from 'express';
import { ApiError } from 'src/types/api-error';
import { getAllConfig, setConfigValue } from './config-controller';
import { roleCheck } from 'src/utils/role-check';
import { Request, Response } from 'express';

const router = express.Router();

router.use((req: Request, res: Response, next: Function) => {
    roleCheck(req, ['SYSTEM_ADMIN']);
    next();
});

router.get('/all', getAllConfig);
router.post('/', setConfigValue);
router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as configRouter };
