import { ApiResponse } from '@shared/types/api/api-response';
import { ApiCreateWorker, ApiGetWorker, ApiUpdateWorker } from '@shared/types/api/api-worker';
import { workerController } from '@src/controllers/worker-controller';
import { ApiError } from '@src/types/api-error';
import express from 'express';
import z from 'zod';

const router = express.Router();

// === Create worker ===

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
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    const worker = await workerController().createWorker(data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(201).json(response);
});

// === Get worker ===

router.get('/:workerId', async (req, res) => {
    const workerId = req.params.workerId as string | undefined;

    if (!workerId) throw new ApiError(400, 'Worker ID is required');

    const worker = await workerController().getWorker(workerId);

    const response: ApiResponse<ApiGetWorker> = {
        status: 'SUCCESS',
        data: {
            id: worker.id,
            name: worker.name,
            lastname: worker.lastname,
            email: worker.email,
            active: worker.active,
            sync: true ? worker.sync : undefined, // TODO: Only if role of user is admin
        },
    };
    res.status(200).json(response);
});

// === Update worker ===

const updateWorkerSchema: z.Schema<ApiUpdateWorker> = z.object({
    name: z.string().optional(),
    lastname: z.string().optional(),
    email: z.string().optional(),
    active: z.boolean().optional(),
    sync: z.boolean().optional(),
});

router.put('/:workerId', async (req, res) => {
    const workerId = req.params.workerId as string | undefined;

    if (!workerId) throw new ApiError(400, 'Worker ID is required');

    const data = updateWorkerSchema.safeParse(req.body);

    if (data.data?.sync !== undefined && false) throw new ApiError(403, 'FORBIDDEN'); // TODO: Only if role of user is admin

    if (!data.success)
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    await workerController().updateWorker(workerId, data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

// === Delete worker ===

router.delete('/:workerId', async (req, res) => {
    const workerId = req.params.workerId as string | undefined;

    if (!workerId) throw new ApiError(400, 'Worker ID is required');

    await workerController().deleteWorker(workerId);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

export { router as workerRouter };
