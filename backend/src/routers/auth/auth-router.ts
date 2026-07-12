import express, { Request, Response } from 'express';
import { microsoftRouter } from './microsoft-router';
import { ENV } from '@src/config/enviroment';
import { ApiAuthConfig } from '@shared/types/api/api-auth';
import { ApiResponse } from '@sharedtypes/api-response';
import { authController } from '@src/controllers/auth-controller';
import { ApiError } from '@src/types/api-error';

const router = express.Router();

// router.use('/local', groupRouter);
if (ENV.MICROSOFT_ENABLED) {
    router.use('/microsoft', microsoftRouter);
}

router.get('/config', async (req: Request, res: Response) => {
    const response: ApiResponse<ApiAuthConfig> = {
        status: 'SUCCESS',
        data: await authController().getConfig(),
    };
    res.status(200).json(response);
});

router.get('/user', async (req: Request, res: Response) => {
    const response: ApiResponse<unknown> = {
        status: 'SUCCESS',
        data: await authController().getUser(req),
    };
    res.status(200).json(response);
});

router.get('/logout', async (req: Request, res: Response) => {
    await authController().logout(req, res);
});

export { router as authRouter };
