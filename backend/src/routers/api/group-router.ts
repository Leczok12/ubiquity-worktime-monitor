import { ApiCreateGroup, ApiGetGroup, ApiUpdateGroup } from '@shared/types/api/api-group';
import { ApiResponse } from '@shared/types/api/api-response';
import { ApiGetWorker } from '@shared/types/api/api-worker';
import { groupController } from '@src/controllers/group-controller';
import { ApiError } from '@src/types/api-error';
import { pagination } from '@src/utils/pagination';
import express from 'express';
import z from 'zod';

const router = express.Router();

// === Create group === [ADMIN]

const createGroupSchema: z.Schema<ApiCreateGroup> = z.object({
    id: z.string().optional(),
    name: z.string().max(100),
    sync: z.boolean().optional(),
});

router.post('/', async (req, res) => {
    const data = createGroupSchema.safeParse(req.body);

    if (!data.success)
        throw new ApiError(
            400,
            'INVALID_ARGS',
            data.error.issues.map((issue) => issue.message).join(', ')
        );

    await groupController().createGroup(data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

// === Get group ===

router.get('/all', async (req, res) => {
    const skipShow = req.query.skipShow as string | undefined;

    if (skipShow === 'true' && false) throw new ApiError(403, 'FORBIDDEN'); // TODO: Only if role of user is admin

    const { pageNumber, pageSize } = pagination(req);

    const groups = await groupController().getGroups(pageSize, pageNumber, skipShow === 'true');

    const response: ApiResponse<ApiGetGroup[]> = {
        status: 'SUCCESS',
        data: groups.data.map((group) => ({
            id: group.id,
            name: group.name,
            show: skipShow === 'true' ? group.show : undefined,
        })),
        pagination: groups.pagination,
    };
    res.status(200).json(response);
});

router.get('/:groupId/worker/all', async (req, res) => {
    const groupId = req.params.groupId as string | undefined;
    const skipShow = req.query.skipShow as string | undefined;

    if (skipShow === 'true' && false) throw new ApiError(403, 'FORBIDDEN'); // TODO: Only if role of user is admin

    if (!groupId) throw new ApiError(400, 'INVALID_ARGS', 'Group ID is required');

    const { pageNumber, pageSize } = pagination(req);

    const workers = await groupController().getGroupWorkers(
        groupId,
        pageSize,
        pageNumber,
        skipShow === 'true'
    );

    const response: ApiResponse<ApiGetWorker[]> = {
        status: 'SUCCESS',
        data: workers.data.map((worker) => ({
            id: worker.id,
            name: worker.name,
            lastname: worker.lastname,
            email: worker.email,
            active: worker.active,
            show: skipShow === 'true' ? worker.show : undefined,
        })),
        pagination: workers.pagination,
    };
    res.status(200).json(response);
});

router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId as string | undefined;
    const skipShow = req.query.skipShow as string | undefined;

    if (skipShow === 'true' && false) throw new ApiError(403, 'FORBIDDEN'); // TODO: Only if role of user is admin

    if (!groupId) throw new ApiError(400, 'INVALID_ARGS', 'Group ID is required');

    const group = await groupController().getGroup(groupId, skipShow === 'true');

    const response: ApiResponse<ApiGetGroup> = {
        status: 'SUCCESS',
        data: group,
    };
    res.status(200).json(response);
});

// === Update group === [ADMIN]

router.put('/:groupId/worker/:workerId', async (req, res) => {
    const groupId = req.params.groupId as string | undefined;
    const workerId = req.params.workerId as string | undefined;

    if (!groupId) throw new ApiError(400, 'INVALID_ARGS', 'Group ID is required');
    if (!workerId) throw new ApiError(400, 'INVALID_ARGS', 'Worker ID is required');

    await groupController().updateGroupWorker(groupId, workerId);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

const updateGroupSchema: z.Schema<ApiUpdateGroup> = z.object({
    name: z.string().max(100).optional(),
    show: z.boolean().optional(),
});

router.put('/:groupId', async (req, res) => {
    const groupId = req.params.groupId as string | undefined;

    if (!groupId) throw new ApiError(400, 'INVALID_ARGS', 'Group ID is required');

    const data = updateGroupSchema.safeParse(req.body);

    if (!data.success)
        throw new ApiError(
            400,
            'INVALID_ARGS',
            data.error.issues.map((issue) => issue.message).join(', ')
        );

    await groupController().updateGroup(groupId, data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

// === Delete group === [ADMIN]

router.delete('/:groupId/worker/:workerId', async (req, res) => {
    const groupId = req.params.groupId as string | undefined;
    const workerId = req.params.workerId as string | undefined;

    if (!groupId) throw new ApiError(400, 'INVALID_ARGS', 'Group ID is required');
    if (!workerId) throw new ApiError(400, 'INVALID_ARGS', 'Worker ID is required');

    await groupController().deleteGroupWorker(groupId, workerId);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

router.delete('/:groupId', async (req, res) => {
    const groupId = req.params.groupId as string | undefined;

    if (!groupId) throw new ApiError(400, 'INVALID_ARGS', 'Group ID is required');

    await groupController().deleteGroup(groupId);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

export { router as groupRouter };
