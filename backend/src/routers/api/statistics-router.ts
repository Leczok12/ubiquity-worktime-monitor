import { ApiResponse } from '@shared/types/api/api-response';
import { ApiGetStatistics } from '@shared/types/api/api-statistics';
import { statisticsController } from '@src/controllers/statistics-controller';
import { ApiError } from '@src/types/api-error';
import express from 'express';

const router = express.Router();

// === Get statistics === [VIEWER]

router.get('/', async (req, res) => {
    const extended = req.query.extended as string | undefined;

    if (extended === 'true' && false) throw new ApiError(403, 'FORBIDDEN'); // TODO: Only if role of user is admin

    const statistics = await statisticsController().getStatistics(extended === 'true');

    const response: ApiResponse<ApiGetStatistics> = {
        status: 'SUCCESS',
        data: statistics,
    };

    res.status(200).json(response);
});

export { router as statisticsRouter };
