import { $Enums } from '@prisma/client';
import { ApiResponse } from '@shared/types/api/api-response';
import { ApiGetStatistics } from '@shared/types/api/api-statistics';
import { statisticsController } from '@src/controllers/statistics-controller';
import { authorizerMiddleware } from '@src/middlewares/authorizer-middleware';
import { ApiError } from '@src/types/api-error';
import { authorizer } from '@src/utils/authorizer';
import express from 'express';

const router = express.Router();

// === Get statistics === [VIEWER]

router.get('/', authorizerMiddleware($Enums.UserRole.VIEWER), async (req, res) => {
    const extended = req.query.extended as string | undefined;

    if (extended === 'true') authorizer(req, $Enums.UserRole.SYSTEM_ADMIN);

    const statistics = await statisticsController().getStatistics(extended === 'true');

    const response: ApiResponse<ApiGetStatistics> = {
        status: 'SUCCESS',
        data: statistics,
    };

    res.status(200).json(response);
});

export { router as statisticsRouter };
