import { $Enums } from '@prisma/client';
import { ApiGetConfig } from '@shared/types/api/api-config';
import { ApiResponse } from '@shared/types/api/api-response';
import { authorizerMiddleware } from '@src/middlewares/authorizer-middleware';
import express from 'express';
import { environment as env } from '@src/services/environment';

const router = express.Router();

// === Get config === [ADMIN]

router.get('/', authorizerMiddleware($Enums.UserRole.SYSTEM_ADMIN), async (req, res) => {
    const response: ApiResponse<ApiGetConfig> = {
        status: 'SUCCESS',
        data: [
            {
                name: 'DEV',
                value: env.DEV.toString(),
            },
            {
                name: 'SERVER_PORT',
                value: env.SERVER_PORT,
            },
            {
                name: 'SERVER_URL',
                value: env.SERVER_URL,
            },
            {
                name: 'LOG_LEVEL',
                value: env.LOG_LEVEL.toString(),
            },
            {
                name: 'TZ',
                value: env.TZ,
            },
            {
                name: 'END_OF_DAY_OFFSET',
                value: env.END_OF_DAY_OFFSET.toString(),
            },
            {
                name: 'DISPLAY_DATE_OFFSET',
                value: env.DISPLAY_DATE_OFFSET.toString(),
            },
            {
                name: 'UBIQUITI_FULL_SYNC_CRON',
                value: env.UBIQUITI_FULL_SYNC_CRON,
            },
            {
                name: 'UBIQUITI_PARTIAL_SYNC_CRON',
                value: env.UBIQUITI_PARTIAL_SYNC_CRON,
            },
            { name: 'UBIQUITI_HOST', value: env.UBIQUITI_HOST },
            {
                name: 'UBIQUITI_API_KEY',
                value: env.UBIQUITI_API_KEY !== '' ? '***' + env.UBIQUITI_API_KEY.slice(-2) : '',
            },
            { name: 'UBIQUITI_SYNC_ON_STARTUP', value: env.UBIQUITI_SYNC_ON_STARTUP.toString() },
            {
                name: 'UBIQUITI_NEW_WORKER_DEFAULT_SHOW',
                value: env.UBIQUITI_NEW_WORKER_DEFAULT_SHOW.toString(),
            },
            {
                name: 'UBIQUITI_NEW_GROUP_DEFAULT_SHOW',
                value: env.UBIQUITI_NEW_GROUP_DEFAULT_SHOW.toString(),
            },
            { name: 'MICROSOFT_ENABLED', value: env.MICROSOFT_ENABLED.toString() },
            { name: 'MICROSOFT_LOGIN_LABEL', value: env.MICROSOFT_LOGIN_LABEL.toString() },
            { name: 'MICROSOFT_CLIENT_ID', value: env.MICROSOFT_CLIENT_ID },
            {
                name: 'MICROSOFT_CLIENT_SECRET',
                value:
                    env.MICROSOFT_CLIENT_SECRET !== ''
                        ? '***' + env.MICROSOFT_CLIENT_SECRET.slice(-2)
                        : '',
            },
            { name: 'MICROSOFT_TENANT_ID', value: env.MICROSOFT_TENANT_ID },
            { name: 'GOOGLE_ENABLED', value: env.GOOGLE_ENABLED.toString() },
            { name: 'GOOGLE_LOGIN_LABEL', value: env.GOOGLE_LOGIN_LABEL.toString() },
            { name: 'GOOGLE_CLIENT_ID', value: env.GOOGLE_CLIENT_ID },
            {
                name: 'GOOGLE_CLIENT_SECRET',
                value:
                    env.GOOGLE_CLIENT_SECRET !== ''
                        ? '***' + env.GOOGLE_CLIENT_SECRET.slice(-2)
                        : '',
            },
        ],
    };

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay for testing

    res.status(200).json(response);
});

export { router as configRouter };
