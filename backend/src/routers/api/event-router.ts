import { $Enums } from '@prisma/client';
import { ApiUpdateEvent, ApiCreateEvent, ApiGetEventExtended, ApiGetEvent } from '@shared/types/api/api-event';
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

// === Get event === [VIEWER]

router.get('/:eventId', async (req, res) => {
    const eventId = req.params.eventId as string | undefined;

    if (!eventId) throw new ApiError(400, 'INVALID_ARGS', 'Event ID is required');

    const extended = req.query.extended === 'true';

    if (extended) {
        const event = await eventController().getEventExtended(eventId);

        const response: ApiResponse<ApiGetEventExtended> = {
            status: 'SUCCESS',
            data: {
                id: event.id,
                date: event.date.toISOString(),
                device: event.device
                    ? {
                          id: event.device.id,
                          name: event.device.name,
                          type: event.device.type,
                      }
                    : undefined,
                worker: event.worker
                    ? {
                          id: event.worker.id,
                          name: event.worker.name,
                          lastname: event.worker.lastname,
                          email: event.worker.email,
                          active: event.worker.active,
                          sync: undefined,
                      }
                    : undefined,
            },
        };
        res.status(200).json(response);
    } else {
        const event = await eventController().getEvent(eventId);

        const response: ApiResponse<ApiGetEvent> = {
            status: 'SUCCESS',
            data: {
                id: event.id,
                deviceId: event.deviceId,
                workerId: event.workerId,
                date: event.date.toISOString(),
            },
        };
        res.status(200).json(response);
    }
});

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
