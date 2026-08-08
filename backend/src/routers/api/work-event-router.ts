import { $Enums } from '@prisma/client';
import { ApiResponse } from '@shared/types/api/api-response';
import { ApiGetWorkEventGrouped } from '@shared/types/api/api-work-event';
import { WorkEventController } from '@src/controllers/work-event-controller';
import { authorizerMiddleware } from '@src/middlewares/authorizer-middleware';
import { ApiError } from '@src/types/api-error';
import { authorizer } from '@src/utils/authorizer';
import express from 'express';

const router = express.Router();

// === Get work events === [worker]

router.get('/:workerId', authorizerMiddleware($Enums.UserRole.WORKER), async (req, res) => {
    const workerId = req.params.workerId as string;
    const rawStartDate = req.query.startDate as string | undefined;
    const rawEndDate = req.query.endDate as string | undefined;

    if (!workerId || !rawStartDate || !rawEndDate) {
        throw new ApiError(400, 'INVALID_ARGS', 'workerId, startDate, and endDate are required');
    }

    if (
        new Date(rawStartDate).toISOString() !== rawStartDate ||
        new Date(rawEndDate).toISOString() !== rawEndDate
    ) {
        throw new ApiError(400, 'INVALID_ARGS', 'Invalid date format');
    }

    const startDate = new Date(rawStartDate);
    const endDate = new Date(rawEndDate);

    if (req.user?.workerId && req.user.workerId !== workerId) {
        authorizer(req, $Enums.UserRole.VIEWER);
    }

    const response: ApiResponse<ApiGetWorkEventGrouped[]> = {
        status: 'SUCCESS',
        data: await WorkEventController().getWorkEventsGrouped(workerId, startDate, endDate),
    };

    res.status(200).json(response);
});

export { router as workEventRouter };
