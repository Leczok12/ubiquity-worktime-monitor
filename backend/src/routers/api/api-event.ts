import { $Enums } from '@prisma/client';
import { ApiUpdateEvent, ApiCreateEvent } from '@shared/types/api/api-event';
import { ApiResponse } from '@shared/types/api/api-response';
import { deviceController } from '@src/controllers/device-controller';
import { eventController } from '@src/controllers/event-controller';
import { ApiError } from '@src/types/api-error';
import { pagination } from '@src/utils/pagination';
import express from 'express';
import z from 'zod';

const router = express.Router();

// === Create event === [ADMIN]

const createEventSchema: z.Schema<ApiCreateEvent> = z.object({
    id: z.string().optional(),
    deviceId: z.string(),
    workerId: z.string(),
    date: z.string(),
});

router.post('/', async (req, res) => {
    const data = createEventSchema.safeParse(req.body);

    if (!data.success)
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    await eventController().createEvent(data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

// === Get event === [MANAGER]

// router.get('/all', async (req, res) => {
//     const { pageNumber, pageSize } = pagination(req);

//     const devices = await deviceController().getDevices(pageSize, pageNumber);

//     const response: ApiResponse<ApiGetDevice[]> = {
//         status: 'SUCCESS',
//         data: devices.data.map((device) => ({
//             id: device.id,
//             name: device.name,
//             type: device.type,
//         })),
//         pagination: devices.pagination,
//     };
//     res.status(200).json(response);
// });

// router.get('/:deviceId', async (req, res) => {
//     const deviceId = req.params.deviceId as string | undefined;

//     if (!deviceId) throw new ApiError(400, 'INVALID_ARGS', 'Device ID is required');

//     const device = await deviceController().getDevice(deviceId);

//     const response: ApiResponse<ApiGetDevice> = {
//         status: 'SUCCESS',
//         data: {
//             id: device.id,
//             name: device.name,
//             type: device.type,
//         },
//     };
//     res.status(200).json(response);
// });

// === Update event === [ADMIN]

const updateEventSchema: z.Schema<ApiUpdateEvent> = z.object({
    deviceId: z.string().optional(),
    workerId: z.string().optional(),
    date: z.string().optional(),
});

router.put('/:eventId', async (req, res) => {
    const eventId = req.params.eventId as string | undefined;

    if (!eventId) throw new ApiError(400, 'INVALID_ARGS', 'Event ID is required');

    const data = updateEventSchema.safeParse(req.body);

    if (!data.success)
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    await eventController().updateEvent(eventId, data.data);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

// === Delete event === [ADMIN]

router.delete('/:eventId', async (req, res) => {
    const eventId = req.params.eventId as string | undefined;

    if (!eventId) throw new ApiError(400, 'INVALID_ARGS', 'Event ID is required');

    await eventController().deleteEvent(eventId);

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(200).json(response);
});

export { router as eventRouter };
