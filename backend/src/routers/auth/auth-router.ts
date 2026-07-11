import express, { Request, Response } from 'express';
import { microsoftRouter } from './microsoft-router';
import { ENV } from '@src/config/enviroment';
import { ApiAuthConfig } from '@shared/types/api/api-auth';
import { ApiResponse } from '@sharedtypes/api-response';

const router = express.Router();

// router.use('/local', groupRouter);
if (ENV.MICROSOFT_ENABLED) {
    router.use('/microsoft', microsoftRouter);
}

router.get('/config', (req: Request, res: Response) => {
    const response: ApiResponse<ApiAuthConfig> = {
        status: 'SUCCESS',
        data: {
            microsoft: {
                enabled: ENV.MICROSOFT_ENABLED,
                loginLabel: ENV.MICROSOFT_LOGIN_LABEL,
            },
            google: {
                enabled: ENV.GOOGLE_ENABLED,
                loginLabel: ENV.GOOGLE_LOGIN_LABEL,
            },
        },
    };

    res.status(200).json(response);
});

router.get('/logout', (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: 'Successfully logged out' });
    });
});

export { router as authRouter };
