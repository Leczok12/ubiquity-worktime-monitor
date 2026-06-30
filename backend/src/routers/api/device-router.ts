import { $Enums } from '@prisma/client';
import { ApiCreateDevice, ApiGetDevice, ApiUpdateDevice } from '@shared/types/api/api-device';
import { ApiResponse } from '@shared/types/api/api-response';
import { deviceController } from '@src/controllers/device-controller';
import { ApiError } from '@src/types/api-error';
import { pagination } from '@src/utils/pagination';
import express from 'express';
import z from 'zod';

const router = express.Router();

// === Create device === [ADMIN]

const createDeviceSchema: z.Schema<ApiCreateDevice> = z.object({
    id: z.string().optional(),
    name: z.string(),
    type: z.enum($Enums.DeviceType),
});

router.post('/', async (req, res) => {
    const data = createDeviceSchema.safeParse(req.body);

    if (!data.success)
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    await deviceController().createDevice(data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

// === Get device === [ADMIN]

router.get('/all', async (req, res) => {
    const { pageNumber, pageSize } = pagination(req);

    const devices = await deviceController().getDevices(pageSize, pageNumber);

    const response: ApiResponse<ApiGetDevice[]> = {
        status: 'SUCCESS',
        data: devices.data.map((device) => ({
            id: device.id,
            name: device.name,
            type: device.type,
        })),
        pagination: devices.pagination,
    };
    res.status(200).json(response);
});

router.get('/:deviceId', async (req, res) => {
    const deviceId = req.params.deviceId as string | undefined;

    if (!deviceId) throw new ApiError(400, 'INVALID_ARGS', 'Device ID is required');

    const device = await deviceController().getDevice(deviceId);

    const response: ApiResponse<ApiGetDevice> = {
        status: 'SUCCESS',
        data: {
            id: device.id,
            name: device.name,
            type: device.type,
        },
    };
    res.status(200).json(response);
});

// === Update device === [ADMIN]

const updateDeviceSchema: z.Schema<ApiUpdateDevice> = z.object({
    name: z.string().optional(),
    type: z.enum($Enums.DeviceType).optional(),
});

router.put('/:deviceId', async (req, res) => {
    const deviceId = req.params.deviceId as string | undefined;

    if (!deviceId) throw new ApiError(400, 'INVALID_ARGS', 'Device ID is required');

    const data = updateDeviceSchema.safeParse(req.body);

    if (!data.success)
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    await deviceController().updateDevice(deviceId, data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

// === Delete device === [ADMIN]

router.delete('/:deviceId', async (req, res) => {
    const deviceId = req.params.deviceId as string | undefined;

    if (!deviceId) throw new ApiError(400, 'INVALID_ARGS', 'Device ID is required');

    await deviceController().deleteDevice(deviceId);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

export { router as deviceRouter };
