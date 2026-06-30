import { ApiGetGroup } from '@shared/types/api/api-group';
import { ApiResponse } from '@shared/types/api/api-response';
import { ApiCreateWorker, ApiGetWorker, ApiUpdateWorker } from '@shared/types/api/api-worker';
import { groupController } from '@src/controllers/group-controller';
import { workerController } from '@src/controllers/worker-controller';
import { ApiError } from '@src/types/api-error';
import { pagination } from '@src/utils/pagination';
import express from 'express';
import { skip } from 'node:test';
import z from 'zod';

const router = express.Router();

// === Create worker === [ADMIN]

const createWorkerSchema: z.Schema<ApiCreateWorker> = z.object({
    id: z.string().optional(),
    name: z.string(),
    lastname: z.string(),
    email: z.string(),
    active: z.boolean(),
    sync: z.boolean().optional(),
});

router.post('/', async (req, res) => {
    const data = createWorkerSchema.safeParse(req.body);

    if (!data.success)
        throw new ApiError(
            400,
            'INVALID_ARGS',
            data.error.issues.map((issue) => issue.message).join(', ')
        );

    await workerController().createWorker(data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

// === Get worker ===

router.get('/all', async (req, res) => {
    const skipShow = req.query.skipShow as string | undefined;

    if (skipShow === 'true' && false) throw new ApiError(403, 'FORBIDDEN'); // TODO: Only if role of user is admin

    const { pageNumber, pageSize } = pagination(req);

    const workers = await workerController().getWorkers(pageSize, pageNumber, skipShow === 'true');

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

router.get('/find', async (req, res) => {
    const keyword = req.query.keyword as string | undefined;

    if (!keyword) throw new ApiError(400, 'INVALID_ARGS', 'Keyword is required');

    const skipShow = req.query.skipShow as string | undefined;

    if (skipShow === 'true' && false) throw new ApiError(403, 'FORBIDDEN'); // TODO: Only if role of user is admin

    const { pageNumber, pageSize } = pagination(req);

    const workers = await workerController().findWorkers(
        pageSize,
        pageNumber,
        keyword,
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

router.get('/:workerId/group/all', async (req, res) => {
    const workerId = req.params.workerId as string | undefined;
    const skipShow = req.query.skipShow as string | undefined;

    if (skipShow === 'true' && false) throw new ApiError(403, 'FORBIDDEN'); // TODO: Only if role of user is admin

    if (!workerId) throw new ApiError(400, 'INVALID_ARGS', 'Worker ID is required');

    const { pageNumber, pageSize } = pagination(req);

    const groups = await workerController().getWorkerGroups(
        workerId,
        pageSize,
        pageNumber,
        skipShow === 'true'
    );

    const response: ApiResponse<ApiGetGroup[]> = {
        status: 'SUCCESS',
        data: groups.data.map((group) => ({
            id: group.id,
            name: group.name,
        })),
        pagination: groups.pagination,
    };
    res.status(200).json(response);
});

router.get('/:workerId', async (req, res) => {
    const workerId = req.params.workerId as string | undefined;
    const skipShow = req.query.skipShow as string | undefined;

    if (skipShow === 'true' && false) throw new ApiError(403, 'FORBIDDEN'); // TODO: Only if role of user is admin

    if (!workerId) throw new ApiError(400, 'INVALID_ARGS', 'Worker ID is required');

    const worker = await workerController().getWorker(workerId, skipShow === 'true');

    const response: ApiResponse<ApiGetWorker> = {
        status: 'SUCCESS',
        data: {
            id: worker.id,
            name: worker.name,
            lastname: worker.lastname,
            email: worker.email,
            active: worker.active,
            show: skipShow === 'true' ? worker.show : undefined,
        },
    };
    res.status(200).json(response);
});

// === Update worker === [ADMIN]

router.put('/:workerId/group/:groupId', async (req, res) => {
    const workerId = req.params.workerId as string | undefined;
    const groupId = req.params.groupId as string | undefined;

    if (!workerId) throw new ApiError(400, 'INVALID_ARGS', 'Worker ID is required');
    if (!groupId) throw new ApiError(400, 'INVALID_ARGS', 'Group ID is required');

    await groupController().updateGroupWorker(groupId, workerId);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

const updateWorkerSchema: z.Schema<ApiUpdateWorker> = z.object({
    name: z.string().optional(),
    lastname: z.string().optional(),
    email: z.string().optional(),
    active: z.boolean().optional(),
    sync: z.boolean().optional(),
});

router.put('/:workerId', async (req, res) => {
    const workerId = req.params.workerId as string | undefined;

    if (!workerId) throw new ApiError(400, 'INVALID_ARGS', 'Worker ID is required');

    const data = updateWorkerSchema.safeParse(req.body);

    if (!data.success)
        throw new ApiError(
            400,
            'INVALID_ARGS',
            data.error.issues.map((issue) => issue.message).join(', ')
        );

    await workerController().updateWorker(workerId, data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

// === Delete worker === [ADMIN]

router.delete('/:workerId/group/:groupId', async (req, res) => {
    const workerId = req.params.workerId as string | undefined;
    const groupId = req.params.groupId as string | undefined;

    if (!workerId) throw new ApiError(400, 'INVALID_ARGS', 'Worker ID is required');
    if (!groupId) throw new ApiError(400, 'INVALID_ARGS', 'Group ID is required');

    await groupController().deleteGroupWorker(groupId, workerId);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

router.delete('/:workerId', async (req, res) => {
    const workerId = req.params.workerId as string | undefined;

    if (!workerId) throw new ApiError(400, 'INVALID_ARGS', 'Worker ID is required');

    await workerController().deleteWorker(workerId);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

export { router as workerRouter };
