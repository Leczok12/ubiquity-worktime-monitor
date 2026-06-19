import { ApiCreateGroup, ApiGetGroup, ApiUpdateGroup } from '@shared/types/api/api-group';
import { ApiResponse } from '@shared/types/api/api-response';
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
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    await groupController().createGroup(data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

// === Get group ===

router.get('/all', async (req, res) => {
    const skipSync = req.query.skipSync as string | undefined;

    if (skipSync === 'true' && false) throw new ApiError(403, 'FORBIDDEN'); // TODO: Only if role of user is admin

    const { pageNumber, pageSize } = pagination(req);

    const groups = await groupController().getGroups(pageSize, pageNumber, skipSync === 'true');

    const response: ApiResponse<ApiGetGroup[]> = {
        status: 'SUCCESS',
        data: groups.data.map((group) => ({
            id: group.id,
            name: group.name,
            sync: skipSync === 'true' ? group.sync : undefined,
        })),
        pagination: groups.pagination,
    };
    res.status(200).json(response);
});

router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId as string | undefined;
    const skipSync = req.query.skipSync as string | undefined;

    if (skipSync === 'true' && false) throw new ApiError(403, 'FORBIDDEN'); // TODO: Only if role of user is admin

    if (!groupId) throw new ApiError(400, 'INVALID_ARGS', 'Group ID is required');

    const group = await groupController().getGroup(groupId, skipSync === 'true');

    const response: ApiResponse<ApiGetGroup> = {
        status: 'SUCCESS',
        data: group,
    };
    res.status(200).json(response);
});

// === Update group === [ADMIN]

const updateGroupSchema: z.Schema<ApiUpdateGroup> = z.object({
    name: z.string().max(100),
    sync: z.boolean().optional(),
});

router.put('/:groupId', async (req, res) => {
    const groupId = req.params.groupId as string | undefined;

    if (!groupId) throw new ApiError(400, 'INVALID_ARGS', 'Group ID is required');

    const data = updateGroupSchema.safeParse(req.body);

    if (!data.success)
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    await groupController().updateGroup(groupId, data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

// === Delete group === [ADMIN]

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
