import { $Enums } from '@prisma/client';
import { ApiResponse } from '@shared/types/api/api-response';
import {
    ApiCreateWorkEvent,
    ApiGetWorkEvent,
    ApiGetWorkEventGrouped,
} from '@shared/types/api/api-work-event';
import { workEventController } from '@src/controllers/work-event-controller';
import { authorizerMiddleware } from '@src/middlewares/authorizer-middleware';
import { ApiError } from '@src/types/api-error';
import { authorizer } from '@src/utils/authorizer';
import express from 'express';
import z from 'zod';

const router = express.Router();

// === Create work event === [MANAGER]

const createWorkEventSchema: z.Schema<ApiCreateWorkEvent> = z.object({
    id: z.string().optional(),
    type: z.enum($Enums.WorkEventType),
    sinceDate: z.iso.datetime(),
    untilDate: z.iso.datetime(),
    placeStart: z.string().optional(),
    placeEnd: z.string().optional(),
});

router.post(
    '/worker/:workerId',
    authorizerMiddleware($Enums.UserRole.MANAGER),
    async (req, res) => {
        const workerId = req.params.workerId as string;
        const data = createWorkEventSchema.safeParse(req.body);

        if (!data.success)
            throw new ApiError(
                400,
                'INVALID_ARGS',
                data.error.issues.map((issue) => issue.message).join(', ')
            );

        await workEventController().createWorkEvent(workerId, data.data, req.user?.id);

        const response: ApiResponse<undefined> = {
            status: 'SUCCESS',
        };
        res.status(200).json(response);
    }
);
// === Get work events === [WORKER]

router.get('/worker/:workerId', authorizerMiddleware($Enums.UserRole.WORKER), async (req, res) => {
    const workerId = req.params.workerId as string;
    const rawStartDate = req.query.startDate as string | undefined;
    const rawEndDate = req.query.endDate as string | undefined;

    if (!workerId || !rawStartDate || !rawEndDate) {
        throw new ApiError(400, 'INVALID_ARGS', 'workerId, startDate, and endDate are required');
    }

    if (req.user?.workerId && req.user.workerId !== workerId) {
        authorizer(req, $Enums.UserRole.VIEWER);
    }

    if (
        new Date(rawStartDate).toISOString() !== rawStartDate ||
        new Date(rawEndDate).toISOString() !== rawEndDate
    ) {
        throw new ApiError(400, 'INVALID_ARGS', 'Invalid date format');
    }

    const startDate = new Date(rawStartDate);
    const endDate = new Date(rawEndDate);

    const response: ApiResponse<ApiGetWorkEvent[]> = {
        status: 'SUCCESS',
        data: await workEventController().getWorkEvents(workerId, startDate, endDate),
    };

    res.status(200).json(response);
});

router.get(
    '/worker/:workerId/grouped',
    authorizerMiddleware($Enums.UserRole.WORKER),
    async (req, res) => {
        const workerId = req.params.workerId as string;
        const rawStartDate = req.query.startDate as string | undefined;
        const rawEndDate = req.query.endDate as string | undefined;

        if (!workerId || !rawStartDate || !rawEndDate) {
            throw new ApiError(
                400,
                'INVALID_ARGS',
                'workerId, startDate, and endDate are required'
            );
        }

        if (req.user?.workerId && req.user.workerId !== workerId) {
            authorizer(req, $Enums.UserRole.VIEWER);
        }

        if (
            new Date(rawStartDate).toISOString() !== rawStartDate ||
            new Date(rawEndDate).toISOString() !== rawEndDate
        ) {
            throw new ApiError(400, 'INVALID_ARGS', 'Invalid date format');
        }

        const startDate = new Date(rawStartDate);
        const endDate = new Date(rawEndDate);

        const response: ApiResponse<ApiGetWorkEventGrouped[]> = {
            status: 'SUCCESS',
            data: await workEventController().getWorkEventsGrouped(workerId, startDate, endDate),
        };

        res.status(200).json(response);
    }
);

export { router as workEventRouter };
