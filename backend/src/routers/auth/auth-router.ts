import express, { Request, Response } from 'express';
import { microsoftRouter } from './microsoft-router';
import { environment as env } from '@src/services/environment';
import { ApiAuthConfig } from '@shared/types/api/api-auth';
import { ApiResponse } from '@sharedtypes/api-response';
import { authController } from '@src/controllers/auth-controller';
import { localRouter } from './local-router';
import { googleRouter } from './google-router';

const router = express.Router();

router.use('/local', localRouter);

if (env.MICROSOFT_ENABLED) {
    router.use('/microsoft', microsoftRouter);
}

if (env.GOOGLE_ENABLED) {
    router.use('/google', googleRouter);
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
