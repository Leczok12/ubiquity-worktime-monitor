import { $Enums } from '@prisma/client';
import { ApiCreateGroup, ApiGetGroup, ApiUpdateGroup } from '@shared/types/api/api-group';
import { ApiResponse } from '@shared/types/api/api-response';
import { ApiGetUser, ApiUpdateUser } from '@shared/types/api/api-user';
import { ApiGetWorker } from '@shared/types/api/api-worker';
import { groupController } from '@src/controllers/group-controller';
import { userController } from '@src/controllers/user-controller';
import { authorizerMiddleware } from '@src/middlewares/authorizer-middleware';
import { ApiError } from '@src/types/api-error';
import { authorizer } from '@src/utils/authorizer';
import { pagination } from '@src/utils/pagination';
import express from 'express';
import z from 'zod';

const router = express.Router();

// === Create user === [ADMIN]
// === Get user === [ADMIN]

router.get('/all', authorizerMiddleware($Enums.UserRole.SYSTEM_ADMIN), async (req, res) => {
    const { pageNumber, pageSize } = pagination(req);

    const users = await userController().getUsers(pageSize, pageNumber);

    const response: ApiResponse<ApiGetUser[]> = {
        status: 'SUCCESS',
        data: users.data,
        pagination: users.pagination,
    };
    res.status(200).json(response);
});

router.get('/:userId', authorizerMiddleware($Enums.UserRole.SYSTEM_ADMIN), async (req, res) => {
    const userId = req.params.userId as string | undefined;

    if (!userId) throw new ApiError(400, 'INVALID_ARGS', 'User ID is required');

    const user = await userController().getUser(userId);

    const response: ApiResponse<ApiGetUser> = {
        status: 'SUCCESS',
        data: user,
    };
    res.status(200).json(response);
});

// === Update user === [ADMIN]

const updateUserSchema: z.Schema<ApiUpdateUser> = z.object({
    role: z.nativeEnum($Enums.UserRole).optional(),
});

router.put('/:userId', authorizerMiddleware($Enums.UserRole.SYSTEM_ADMIN), async (req, res) => {
    const userId = req.params.userId as string | undefined;

    if (!userId) throw new ApiError(400, 'INVALID_ARGS', 'User ID is required');

    const data = updateUserSchema.safeParse(req.body);

    if (!data.success)
        throw new ApiError(
            400,
            'INVALID_ARGS',
            data.error.issues.map((issue) => issue.message).join(', ')
        );

    await userController().updateUser(userId, data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

export { router as userRouter };
